package main

import (
	"bytes"
	"context"
	"io"
	"io/ioutil"
	"log"
	"mime/multipart"
	"net/http"
	"os"
	"os/exec"
	"time"

	"github.com/consensys/gnark-crypto/ecc"
	"github.com/consensys/gnark/backend/groth16"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
	nats "github.com/nats-io/nats.go"
	"github.com/pborman/uuid"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
)

// ZKCircuit : Schema for mongoDb
type ZKCircuit struct {
	ID      string `bson:"_id" json:"_id"`
	Name    string `bson:"name" json:"name"`
	CurveID ecc.ID `bson:"curveId" json:"curveId" binding:"required"`
	Status  string `bson:"status" json:"status" form:"status"`
}

type createCircuitReq struct {
	Name       string                `form:"name" json:"name" binding:"required"`
	SourceCode *multipart.FileHeader `form:"sourceCode" json:"sourceCode"`
	CurveID    ecc.ID                `form:"curveId" json:"curveId"`
	Identities []string              `form:"identities" json:"identities"`
}
type WitnessInput struct {
	Name      string `json:"name"`
	InputType string `json:"inputType"`
	Value     string `json:"value"`
}

var compileQueue chan string
var setupQueue chan string
var proveQueue chan string
var verifyQueue chan string
var natsClient *nats.Conn
var dbClient *mongo.Client
var dbName string

const zkCircuitCollection = "zk-circuits"

/******************************************************/
/***      Main                                      ***/
/******************************************************/

func main() {
	godotenv.Load(".env")
	dbName = os.Getenv("DATABASE_NAME")

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	// Connect to mongoDb
	dbClient = DbConnect(ctx)
	defer func() {
		if err := dbClient.Disconnect(ctx); err != nil {
			panic(err)
		}
	}()

	// Connect to NATS
	natsClient = InitNats()
	defer natsClient.Close()

	// Continuosly running background processes
	compileQueue = make(chan string)
	go compileCircuits()

	setupQueue = make(chan string)
	go setupCircuits()

	// Create a gin router with default middleware: logger and recovery
	router := gin.Default()

	router.GET("/status", getStatus)
	router.POST("/zkcircuits", createCircuit)
	router.GET("/zkcircuits", getAllCircuits)
	router.GET("/zkcircuits/:circuitID", getSingleCircuit)
	router.GET("/zkcircuits/:circuitID/verifier", getSolidityVerifier)
	router.POST("/zkcircuits/:circuitID/setup", setup)
	router.POST("/zkcircuits/:circuitID/prove", prove)
	router.POST("/zkcircuits/:circuitID/verify", verify)

	serverPort := os.Getenv("SERVER_PORT")
	router.Run(":" + serverPort)
}

/******************************************************/
/***      Go routines                               ***/
/******************************************************/

func compileCircuit(circuitID string) error {
	log.Println("Starting compilation for circuit: ", circuitID)

	// Copy source code into circuits/circuit.go
	sourceFile := "src/circuits/" + circuitID + "/uncompiled.go"
	destinationFile := "src/circuits/circuit.go"

	input, err := ioutil.ReadFile(sourceFile)
	if err != nil {
		log.Println("ERROR opening file: " + err.Error())
		return err
	}

	err = ioutil.WriteFile(destinationFile, input, 0644)
	if err != nil {
		log.Println("ERROR creating file: " + err.Error())
		return err
	}

	// Compile and create circuit.r1cs file
	cmd := exec.Command("go", "run", ".")
	cmd.Dir = "src/circuits"
	_, err = cmd.Output()
	if err != nil {
		log.Println("ERROR compiling circuit " + circuitID + ": " + err.Error())
		return err
	}

	// Copy circuit.r1cs into circuits/<circuitID>/compiled.r1cs
	sourceFile = "src/circuits/circuit.r1cs"
	destinationFile = "src/circuits/" + circuitID + "/compiled.r1cs"

	input, err = ioutil.ReadFile(sourceFile)
	if err != nil {
		log.Println("ERROR opening file: " + err.Error())
		return err
	}

	err = ioutil.WriteFile(destinationFile, input, 0644)
	if err != nil {
		log.Println("ERROR creating file: " + err.Error())
		return err
	}

	// Update zk-circuit in db: set status to "compiled"
	collection := dbClient.Database(dbName).Collection(zkCircuitCollection)
	ctx, cancel := context.WithTimeout(context.Background(), 20*time.Second)
	defer cancel()

	filter := bson.M{"_id": circuitID}
	update := bson.M{"$set": bson.M{"status": "compiled"}}

	_, err = collection.UpdateOne(ctx, filter, update)
	if err != nil {
		log.Println("ERROR updating db: " + err.Error())
		return err
	}
	log.Println("Finished compilation for circuit: ", circuitID)
	return nil
}

func compileCircuits() {
	for {
		circuitID := <-compileQueue
		compileCircuit(circuitID)
	}
}

func setupCircuit(circuitID string) error {
	log.Println("Starting setup for circuit: ", circuitID)

	// Get zk circuit collection for later updates
	collection := dbClient.Database(dbName).Collection(zkCircuitCollection)
	ctx, cancel := context.WithTimeout(context.Background(), 20*time.Second)
	defer cancel()
	filter := bson.M{"_id": circuitID}

	// Create reader for r1cs file
	//NOTE: shoudl we use a blob store (S3) or put in MongoDb
	//NOTE: Create a storage provider interface with IoC style implemetnation in our case we can use lcoalstack S3 but interface should
	//      support any file system, or any cloud repository (define interface and implement with S3 ) IStorageProvider
	path := "src/circuits/" + circuitID + "/compiled.r1cs"
	var r io.Reader
	r, err := os.Open(path)
	if err != nil {
		log.Println("[ERROR: Read r1cs file] " + err.Error())
		update := bson.M{"$set": bson.M{"status": "setup_failed"}}
		_, err = collection.UpdateOne(ctx, filter, update)
		return err
	}

	// Decode r1cs binary, store in compiledCircuit
	log.Println("Decoding r1cs binary for circuit: ", circuitID)
	compiledCircuit := groth16.NewCS(ecc.BN254)
	_, err = compiledCircuit.ReadFrom(r)

	if err != nil {
		log.Println("[ERROR: Decode r1cs] " + err.Error())
		update := bson.M{"$set": bson.M{"status": "setup_failed"}}
		_, err = collection.UpdateOne(ctx, filter, update)
		return err
	}

	log.Println("Decoding r1cs binary complete for circuit: ", circuitID)
	log.Println("Running groth16 setup for circuit: ", circuitID)
	pk, vk, err := groth16.Setup(compiledCircuit)

	if err != nil {
		log.Println("[ERROR: Gnark setup] " + err.Error())
		update := bson.M{"$set": bson.M{"status": "setup_failed"}}
		_, err = collection.UpdateOne(ctx, filter, update)
		return err
	}

	log.Println("groth16 setup complete for circuit: ", circuitID)
	log.Println("Creating Solidity verifier for circuit: ", circuitID)
	path = "src/circuits/" + circuitID + "/Verifier.sol"
	file, _ := os.Create(path)
	err = vk.ExportSolidity(file)
	if err != nil {
		log.Println("[ERROR: Export Solidity] " + err.Error())
		update := bson.M{"$set": bson.M{"status": "setup_failed"}}
		_, err = collection.UpdateOne(ctx, filter, update)
		return err
	}

	// Write compressed keys to disk
	log.Println("Solidity verifier created for circuit: ", circuitID)
	log.Println("Creating proving.key file for circuit: ", circuitID)
	path = "src/circuits/" + circuitID + "/proving.key"
	pkFile, _ := os.Create(path)
	pk.WriteTo(pkFile)

	log.Println("Created proving.key file for circuit: ", circuitID)
	log.Println("Creating verifying.key file for circuit: ", circuitID)
	path = "src/circuits/" + circuitID + "/verifying.key"
	vkFile, _ := os.Create(path)
	vk.WriteTo(vkFile)

	// Update db to add keys, update status
	log.Println("Created verifying.key file for circuit: ", circuitID)
	log.Println("Updating db metadata for circuit: ", circuitID)
	update := bson.M{"$set": bson.M{"status": "setup_complete"}}
	_, err = collection.UpdateOne(ctx, filter, update)
	if err != nil {
		log.Println("[ERROR: Mongo UpdateOne] " + err.Error())
		return err
	}
	log.Println("Finished setup for circuit: ", circuitID)
	return nil
}

func setupCircuits() {
	for {
		circuitID := <-setupQueue
		setupCircuit(circuitID)
	}
}

/******************************************************/
/***      Router functions                          ***/
/******************************************************/

func getStatus(c *gin.Context) {
	c.String(http.StatusOK, "Zkp service is running")
}

func getSolidityVerifier(c *gin.Context) {
	circuitID := c.Param("circuitID")
	mimeType, fileContents, err := DownloadSolidity(circuitID)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": err})
		return
	}
	c.Header("Content-Disposition", "attachment; filename=Verifier.sol")
	c.Data(http.StatusOK, mimeType, fileContents)
}

func getSingleCircuit(c *gin.Context) {
	var circuit ZKCircuit
	circuitID := c.Param("circuitID")

	collection := dbClient.Database(dbName).Collection(zkCircuitCollection)
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	filter := bson.M{"_id": circuitID}
	err := collection.FindOne(ctx, filter).Decode(&circuit)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{ "error": "Could not query database" })
		return
	}

	c.JSON(http.StatusOK, circuit)
}

func getAllCircuits(c *gin.Context) {
	collection := dbClient.Database(dbName).Collection(zkCircuitCollection)
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	var circuits []bson.M

	cursor, err := collection.Find(ctx, bson.M{})
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{ "error": "Could not query database" })
		return
	}
	defer cursor.Close(ctx)

	for cursor.Next(ctx) {
		var circuit bson.M
		if err = cursor.Decode(&circuit); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{ "error": err.Error() })
			return
		}
		circuits = append(circuits, circuit)
	}
	c.JSON(http.StatusOK, circuits)
}

func createCircuit(c *gin.Context) {
	var requestBody createCircuitReq
	var zkCircuitDoc ZKCircuit

	err := c.ShouldBind(&requestBody)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{ "error": "Request body missing fields:" + err.Error() })
		return
	}
	circuitType := c.Query("type")

	// Create new uuid v4
	circuitId := uuid.NewRandom().String()
	zkCircuitDoc.ID = circuitId
	zkCircuitDoc.Name = requestBody.Name
	zkCircuitDoc.Status = "created"
	zkCircuitDoc.CurveID = ecc.BN254 // default curveId is BN256 for now
	if requestBody.CurveID != 0 {
		zkCircuitDoc.CurveID = requestBody.CurveID
	}

	os.Mkdir("src/circuits/"+circuitId+"/", 0755)
	if circuitType == "signature" {
		// Pass identities to circuit generator
		generateSignatureCircuit(circuitId, requestBody.Identities)
	} else {
		// Create temporary source file
		file, err := c.FormFile("sourceCode")
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{ "error": err.Error() })
			return
		}

		err = c.SaveUploadedFile(file, "src/circuits/"+circuitId+"/uncompiled.go")
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{ "error": "Could not save uploaded file:" + err.Error() })
			return
		}
	}

	// Save file artifacts in db
	collection := dbClient.Database(dbName).Collection(zkCircuitCollection)
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	result, err := collection.InsertOne(ctx, zkCircuitDoc)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{ "error": "Mongo InsertOne:" + err.Error() })
		return
	}

	// Create new job to compile circuit, which creates circuit.r1cs
	compileQueue <- circuitId
	c.JSON(http.StatusCreated, result)
}

func setup(c *gin.Context) {
	circuitID := c.Param("circuitID")

	// Update db to add keys, update status
	collection := dbClient.Database(dbName).Collection(zkCircuitCollection)
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	filter := bson.M{"_id": circuitID}
	update := bson.M{"$set": bson.M{"status": "setup_started"}}
	_, err := collection.UpdateOne(ctx, filter, update)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{ "error": "[Mongo UpdateOne] " + err.Error() })
		return
	}

	// Create new job to generate proving/verifying key
	setupQueue <- circuitID
	c.JSON(http.StatusOK, gin.H{ "message": "Setup job queued for circuit ID " + circuitID })
}

// Currently only supports groth16
func prove(ginContext *gin.Context) {
	// Witness variables must be ordered as defined in Circuit definition
	// Public variables come first, then secret variables
	type generateProofReq struct {
		Witness []WitnessInput `form:"witness" json:"witness" xml:"witness"  binding:"required"`
	}

	var requestBody generateProofReq
	err := ginContext.BindJSON(&requestBody)
	if err != nil {
		ginContext.JSON(http.StatusBadRequest, gin.H{ "error": "Request body missing fields" })
	}
	circuitID := ginContext.Param("circuitID")

	compiledCircuit, provingKey, err := GetCompiledCircuit(circuitID)
	if err != nil {
		ginContext.JSON(http.StatusInternalServerError, gin.H{ "error": err.Error() })
		return
	}

	encodedWitnessHex, err := EncodeWitness(requestBody.Witness)
	if err != nil {
		log.Println("ERROR:", err)
		ginContext.JSON(http.StatusInternalServerError, gin.H{ "error": "[encoding witness] " + err.Error() })
		return
	}

	proofBytes, proofSolidity, err := GenerateProof(compiledCircuit, provingKey, encodedWitnessHex)
	if err != nil {
		log.Println("ERROR:", err)
		ginContext.JSON(http.StatusInternalServerError, gin.H{ "error": "[generating proof] " + err.Error() })
		return
	}

	ginContext.JSON(http.StatusOK, gin.H{
		"proof_rawBytes": proofBytes,
		"proof_solidity": gin.H{ 
			"a": proofSolidity.a,
			"b": proofSolidity.b,
			"c": proofSolidity.c,
		},
	})
}

func verify(c *gin.Context) {
	// Witness only needs to contain public inputs here
	// Variables must be ordered as defined in Circuit definition
	type verifyProofReq struct {
		Proof   []byte         `form:"proof" json:"proof" xml:"proof"  binding:"required"`
		Witness []WitnessInput `form:"witness" json:"witness" xml:"witness"`
	}

	var requestBody verifyProofReq
	err := c.BindJSON(&requestBody)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{ "error": "[Parsing request body] " + err.Error() })
		return
	}

	circuitID := c.Param("circuitID")

	// Get circuit from db
	var circuit ZKCircuit
	collection := dbClient.Database(dbName).Collection(zkCircuitCollection)
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	filter := bson.M{"_id": circuitID}
	err = collection.FindOne(ctx, filter).Decode(&circuit)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{ "error": "[Mongo FindOne] " + err.Error() })
		return
	}

	// Read proving key from disk and convert to groth16.ProvingKey
	path := "src/circuits/" + circuitID + "/verifying.key"
	var vkReader io.Reader
	vkReader, err = os.Open(path)
	verifyingKey := groth16.NewVerifyingKey(ecc.BN254)
	_, err = verifyingKey.ReadFrom(vkReader)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{ "error": "[Read verifying.key file] " + err.Error() })
		return
	}
	log.Println("Successfully read verifying.key from file")

	// Convert proof
	proofBuf := bytes.NewReader(requestBody.Proof)
	proof := groth16.NewProof(ecc.BN254)
	proof.ReadFrom(proofBuf)

	// Create witness io.Reader, then verify proof using witness
	encodedHex, err := EncodeWitness(requestBody.Witness)
	var witnessBuffer bytes.Buffer
	witnessBuffer.Write([]byte(encodedHex))
	if err = groth16.ReadAndVerify(proof, verifyingKey, &witnessBuffer); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{ "error": "[groth16.Verify] " + err.Error() })
		return
	}
	
	c.JSON(http.StatusOK, gin.H{ "result": "verified" })
}

func DownloadSolidity(circuitId string) (string, []byte, error) {
	dst := "src/circuits/" + circuitId + "/Verifier.sol"
	contents, err := ioutil.ReadFile(dst)
	if err != nil {
		return "", nil, err
	}
	mimeType := http.DetectContentType(contents[:512])
	return mimeType, contents, nil
}
