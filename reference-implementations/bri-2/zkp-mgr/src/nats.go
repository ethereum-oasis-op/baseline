package main

import (
	"bytes"
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"log"
	"math/big"
	"net/http"
	"os"
	"time"

	"github.com/consensys/gnark-crypto/ecc"
	"github.com/joho/godotenv"
	nats "github.com/nats-io/nats.go"
	"github.com/pborman/uuid"
)

type circuitCompileMsg struct {
	WorkflowId  string
	Identities  []string
	circuitType string
}

type workflowSetupMsg struct {
	WorkflowId  string
	ZkCircuitId string
}

type generateProofMsg struct {
	CommitId  string
	ZkCircuitId string
	Witness []WitnessInput
	ProofSolidityA_0 string
	ProofSolidityA_1 string
	ProofSolidityB_0_0 string
	ProofSolidityB_0_1 string
	ProofSolidityB_1_0 string
	ProofSolidityB_1_1 string
	ProofSolidityC_0 string
	ProofSolidityC_1 string
	ProofRawBytes []byte
	PublicInput string
	HashValue string
}

var SNARK_SCALAR_FIELD, _ = new(big.Int).SetString("21888242871839275222246405745257275088548364400416034343698204186575808495617", 10)

func InitNats() *nats.Conn {
	// Get NATS_URL from .env
	godotenv.Load(".env")
	natsUrl := os.Getenv("NATS_URL")

	// Connect to NATS server
	nc, err := nats.Connect(
		natsUrl,
		nats.Name("Demo connection name"),
		nats.Timeout(10*time.Second),
		nats.DisconnectErrHandler(func(nc *nats.Conn, err error) {
			// handle disconnect error event
			fmt.Println("Error: nats disconnected")
		}),
		nats.ReconnectHandler(func(nc *nats.Conn) {
			// handle reconnect event
			fmt.Println("Success: nats reconnected")
		}),
		nats.ReconnectWait(3*time.Second))

	if err != nil {
		log.Fatal(err)
	}

	// Subscribe to subjects processed by zkp-mgr
	//TODO: The function complete / orchestrate should e outside of teh subscriber functon
	//      so it can be tested in isolation fo the subscription event.
	nc.Subscribe("new-workflow-allocation", func(m *nats.Msg) {
		log.Println("NATS new-workflow-allocation: received new request")
		var msgData circuitCompileMsg
		var zkCircuitDoc ZKCircuit
		var workflowUpdates = make(map[string]string)
		var err error

		json.Unmarshal(m.Data, &msgData)
		log.Println("NATS new-workflow-allocation: processing request for workflowId ", msgData.WorkflowId)

		circuitId := uuid.NewRandom().String()
		zkCircuitDoc.ID = circuitId
		zkCircuitDoc.Name = msgData.circuitType
		zkCircuitDoc.Status = "created"
		zkCircuitDoc.CurveID = ecc.BN254 // default curveId is BN256 for now
		os.Mkdir("src/circuits/"+circuitId+"/", 0755)
		generateSignatureCircuit(circuitId, msgData.Identities)

		// Save zkCircuit status as "created"
		collection := dbClient.Database(dbName).Collection(zkCircuitCollection)
		ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)

		_, err = collection.InsertOne(ctx, zkCircuitDoc)
		cancel()
		if err != nil {
			// Save workflow status: fail-circuit-compile
			workflowUpdates["status"] = "fail-circuit-compile"
			updateWorkflow(msgData.WorkflowId, workflowUpdates)
			return
		}

		// Compile circuit
		err = compileCircuit(circuitId)
		if err != nil {
			// Save workflow status: fail-circuit-compile
			workflowUpdates["status"] = "fail-circuit-compile"
			updateWorkflow(msgData.WorkflowId, workflowUpdates)
			return
		}

		// Save workflow status: success-circuit-compile
		// PUT /workflows/{id}
		workflowUpdates["status"] = "success-circuit-compile"
		workflowUpdates["zkCircuitId"] = circuitId

		//NOTE: Should this be a async/await against NATS pub/sub against workflow manage eventing, or should it stay as a
		//      "coupled" HTTP request/response???
		updateWorkflow(msgData.WorkflowId, workflowUpdates)

		// Create new "circuit-setup" job
		//TODO: if a publish has been submitted against Workflow service this should be
		//      an additinal sbuscription waiting for the Workflow Updated event
		//      with a sepcific even type or value
		log.Println("NATS circuit-compile: completed request for workflowId ", msgData.WorkflowId)
		var setupMsg workflowSetupMsg
		setupMsg.WorkflowId = msgData.WorkflowId
		setupMsg.ZkCircuitId = circuitId
		encodedSetupMsg, _ := json.Marshal(setupMsg)

		//NOTE: Should this be direct inservice call since there is no boundary breach
		nc.Publish("circuit-setup", encodedSetupMsg)
	})

	nc.Subscribe("circuit-setup", func(m *nats.Msg) {
		log.Println("NATS circuit-setup: received new request")
		var msgData workflowSetupMsg
		var workflowUpdates = make(map[string]string)
		var err error

		json.Unmarshal(m.Data, &msgData)
		log.Println("NATS circuit-setup: processing request for workflowId", msgData.WorkflowId)

		err = setupCircuit(msgData.ZkCircuitId)
		if err != nil {
			// Save workflow status: fail-circuit-compile
			workflowUpdates["status"] = "fail-circuit-setup"
			updateWorkflow(msgData.WorkflowId, workflowUpdates)
			return
		}

		// Save workflow status: success-circuit-setup
		workflowUpdates["status"] = "success-circuit-setup"
		updateWorkflow(msgData.WorkflowId, workflowUpdates)

		// Create new "contracts-compile-verifier" job
		var compileMsg workflowSetupMsg
		compileMsg.WorkflowId = msgData.WorkflowId
		compileMsg.ZkCircuitId = msgData.ZkCircuitId
		encodedCompileMsg, _ := json.Marshal(compileMsg)
		log.Println("NATS circuit-setup: completed job. Adding job to contracts-compile-verifier queue for workflowId", msgData.WorkflowId)
		//NOTE: Terminating messages should not have awareness of next step but rather signal their completion / exit event
		//      in this case it would be circuit-setup-complete event which is what cmpile verifier subsriver would listen for, in addition to it's
		//      own init event message.
		nc.Publish("contracts-compile-verifier", encodedCompileMsg)
	})

	nc.Subscribe("generate-zk-proof", func(m *nats.Msg) {
		log.Println("NATS generate-zk-proof: received new request")
		var msgData generateProofMsg
		var commitUpdates = make(map[string]string)
		var err error

		json.Unmarshal(m.Data, &msgData)
		log.Println("NATS generate-zk-proof: processing request for commitId", msgData.CommitId)

		compiledCircuit, provingKey, err := GetCompiledCircuit(msgData.ZkCircuitId)
		if err != nil {
			// Save commit status: fail-generate-proof
			commitUpdates["status"] = "fail-generate-proof"
			updateWorkflow(msgData.CommitId, commitUpdates)
			return
		}

		encodedWitnessHex, err := EncodeWitness(msgData.Witness)
		if err != nil {
			commitUpdates["status"] = "fail-generate-proof"
			updateWorkflow(msgData.CommitId, commitUpdates)
			return
		}

		proofRawBytes, proofSolidity, err := GenerateProof(compiledCircuit, provingKey, encodedWitnessHex)
		if err != nil {
			commitUpdates["status"] = "fail-generate-proof"
			updateWorkflow(msgData.CommitId, commitUpdates)
			return
		}

		// Create new "proof-generated" job
		var proofGeneratedMsg generateProofMsg
		proofGeneratedMsg.CommitId = msgData.CommitId
		proofGeneratedMsg.ZkCircuitId = msgData.ZkCircuitId
		proofGeneratedMsg.ProofSolidityA_0 = proofSolidity.a[0].String()
		proofGeneratedMsg.ProofSolidityA_1 = proofSolidity.a[1].String()
		proofGeneratedMsg.ProofSolidityB_0_0 = proofSolidity.b[0][0].String()
		proofGeneratedMsg.ProofSolidityB_0_1 = proofSolidity.b[0][1].String()
		proofGeneratedMsg.ProofSolidityB_1_0 = proofSolidity.b[1][0].String()
		proofGeneratedMsg.ProofSolidityB_1_1 = proofSolidity.b[1][1].String()
		proofGeneratedMsg.ProofSolidityC_0 = proofSolidity.c[0].String()
		proofGeneratedMsg.ProofSolidityC_1 = proofSolidity.c[1].String()
		proofGeneratedMsg.ProofRawBytes = proofRawBytes
		
		log.Println("msgData.HashValue =", msgData.HashValue)
		hashValueDecimal, _ := new(big.Int).SetString(strip0x(msgData.HashValue), 16)
		log.Println("decimal of HashValue =", hashValueDecimal)
		proofGeneratedMsg.PublicInput = hashValueDecimal.Mod(hashValueDecimal, SNARK_SCALAR_FIELD).String()

		log.Printf("proof-generated NATS message: %+v", proofGeneratedMsg)
		encodedProofMsg, _ := json.Marshal(proofGeneratedMsg)
		log.Println("NATS generate-zk-proof: completed job. Adding job to proof-generated queue for commitId", msgData.CommitId)
		nc.Publish("proof-generated", encodedProofMsg)
	})

	return nc
}

// Makes a request to PUT /workflows/{id}
// Updates "status" and sometimes sets "zkCircuitId" for the given workflowId
func updateWorkflow(workflowId string, updates map[string]string) error {
	var err error
	godotenv.Load(".env")
	workflowMgrUrl := os.Getenv("WORKFLOW_MGR_URL")

	client := &http.Client{Timeout: time.Second * 10}
	requestUrl := workflowMgrUrl + "/workflows/" + workflowId

	// Encode the data
	putBody, err := json.Marshal(updates)
	if err != nil {
		log.Println("Error converting string map to json:", err.Error())
	}

	encodedPutBody := bytes.NewBuffer(putBody)
	req, _ := http.NewRequest(http.MethodPut, requestUrl, encodedPutBody)
	req.Header.Add("Content-Type", "application/json")
	res, err := client.Do(req)
	if err != nil {
		return err
	}
	if res.StatusCode < 200 || res.StatusCode > 299 {
		log.Println("Error updating workflow: PUT /workflows returned status code" + fmt.Sprint(res.StatusCode))
		httpError := errors.New("PUT /workflows returned status code" + fmt.Sprint(res.StatusCode))
		return httpError
	}
	return nil
}
