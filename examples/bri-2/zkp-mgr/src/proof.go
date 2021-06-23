package main

import (
	"bytes"
	"log"
	"math/big"

	"github.com/consensys/gnark-crypto/ecc/bn254/fp"
	"github.com/consensys/gnark/backend/groth16"
	"github.com/consensys/gnark/frontend"
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

	log.Printf("Proof successfully generated")
	return proofBytes, solidityInput, nil
}
