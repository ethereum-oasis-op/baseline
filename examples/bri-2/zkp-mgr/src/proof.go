package main

import (
	"bytes"
	"context"
	"errors"
	"io"
	"log"
	"math/big"
	"os"
	"time"

	"github.com/consensys/gnark-crypto/ecc"
	"github.com/consensys/gnark-crypto/ecc/bn254/fp"
	"github.com/consensys/gnark/backend/groth16"
	"github.com/consensys/gnark/frontend"
	"go.mongodb.org/mongo-driver/bson"
)

// solidity contract inputs
// a, b and c are the 3 ecc points in the proof we feed to the pairing
// they are stored in the same order in the golang data structure
// each coordinate is a field element, of size fp.Bytes bytes
type SolidityInput struct {
	a     [2]*big.Int
	b     [2][2]*big.Int
	c     [2]*big.Int
}

/************************************************************************/
/** Loop through witness inputs and convert each input to 32 byte uint **/
/************************************************************************/
func GenerateProof(compiledCircuit frontend.CompiledConstraintSystem, provingKey groth16.ProvingKey, witness []byte) ([]byte, SolidityInput, error) {
	log.Println("Generating new proof...")

	var witnessBuffer bytes.Buffer
	witnessBuffer.Write(witness)
	proof, err := groth16.ReadAndProve(compiledCircuit, provingKey, &witnessBuffer)
	if err != nil {
		log.Println("[ERROR: groth16.ReadAndProve" + err.Error())
		emptySolidityInput := SolidityInput{}
		return nil, emptySolidityInput, err
	}

	var proofWriter bytes.Buffer
	proof.WriteRawTo(&proofWriter)
	proofBytes := proofWriter.Bytes()

	// proof.Ar, proof.Bs, proof.Krs
	var solidityInput SolidityInput
	const fpSize = fp.Bytes
	solidityInput.a[0] = new(big.Int).SetBytes(proofBytes[fpSize*0 : fpSize*1])
	solidityInput.a[1] = new(big.Int).SetBytes(proofBytes[fpSize*1 : fpSize*2])
	solidityInput.b[0][0] = new(big.Int).SetBytes(proofBytes[fpSize*2 : fpSize*3])
	solidityInput.b[0][1] = new(big.Int).SetBytes(proofBytes[fpSize*3 : fpSize*4])
	solidityInput.b[1][0] = new(big.Int).SetBytes(proofBytes[fpSize*4 : fpSize*5])
	solidityInput.b[1][1] = new(big.Int).SetBytes(proofBytes[fpSize*5 : fpSize*6])
	solidityInput.c[0] = new(big.Int).SetBytes(proofBytes[fpSize*6 : fpSize*7])
	solidityInput.c[1] = new(big.Int).SetBytes(proofBytes[fpSize*7 : fpSize*8])

	log.Println("Proof successfully generated")
	return proofBytes, solidityInput, nil
}

func GetCompiledCircuit(circuitID string) (frontend.CompiledConstraintSystem, groth16.ProvingKey, error) {
	// Create reader for r1cs file
	path := "src/circuits/" + circuitID + "/compiled.r1cs"
	var compiledReader io.Reader
	compiledReader, err := os.Open(path)
	if err != nil {
		errReturn := errors.New("[Read r1cs file] " + err.Error())
		return nil, nil, errReturn
	}
	log.Println("Read from circuit binary file")

	// Decode r1cs binary, store in compiledCircuit
	compiledCircuit := groth16.NewCS(ecc.BN254)
	_, err = compiledCircuit.ReadFrom(compiledReader)
	if err != nil {
		errReturn := errors.New("[Decode r1cs] " + err.Error())
		return nil, nil, errReturn
	}
	log.Println("Converted circuit binary")

	// Get circuit from db
	var circuit ZKCircuit
	collection := dbClient.Database(dbName).Collection(zkCircuitCollection)
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	filter := bson.M{"_id": circuitID}
	err = collection.FindOne(ctx, filter).Decode(&circuit)
	if err != nil {
		errReturn := errors.New("[Mongo FindOne] " + err.Error())
		return nil, nil, errReturn
	}
	log.Println("Retrieved circuit metadata from db")

	// Read proving key from disk and convert to groth16.ProvingKey
	path = "src/circuits/" + circuitID + "/proving.key"
	var pkReader io.Reader
	pkReader, err = os.Open(path)
	provingKey := groth16.NewProvingKey(ecc.BN254)
	_, err = provingKey.ReadFrom(pkReader)
	if err != nil {
		errReturn := errors.New("[Read proving.key file] " + err.Error())
		return nil, nil, errReturn
	}
	log.Println("Successfully read proving.key from file")
	return compiledCircuit, provingKey, nil
}
