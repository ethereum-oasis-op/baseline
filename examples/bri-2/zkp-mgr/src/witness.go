package main

import (
	"encoding/hex"
	"fmt"
	"log"
	"strconv"

	eddsa_gen "github.com/consensys/gnark-crypto/ecc/bn254/twistededwards/eddsa"
)

/************************************************************************/
/** Loop through witness inputs and convert each input to 32 byte uint **/
/************************************************************************/
func EncodeWitness(inputs []WitnessInput) ([]byte, error) {
	var numInputs uint32
	var witnessString string
	for _, input := range inputs {
		log.Printf("Processing input: %+v", input)
		var hexInput string

		// Handle input conversions differently based on type
		switch input.InputType {
		case "signature":
			log.Println("signature input:", input.Value)

			// Convert from hex string to eddsa signature struct
			var sig eddsa_gen.Signature
			sig.SetBytes([]byte(input.Value))

			hexInput = fmt.Sprintf("%064x%064x%064x", sig.R.X.Bytes(), sig.R.Y.Bytes(), sig.S)
			numInputs += 3
		case "hash":
			log.Println("hash input:", input.Value)
			// Pad hash with zeros
			hexInput = input.Value
			numInputs++
		default:
			log.Println("string input:", input.Value)

			// Convert from string to single 64 bit (8 byte) uint
			element_uint64, err := strconv.ParseUint(input.Value, 10, 64)
			if err != nil {
				return nil, err
			}

			// Convert from uint64 to 32-byte hex string
			hexInput = fmt.Sprintf("%064x", element_uint64)
			log.Println("hexInput:", hexInput)
			numInputs++
		}

		// Update counters
		witnessString += hexInput
		log.Printf("witnessString: %s", witnessString)
	}

	// Convert number of inputs to hex of uint32
	fullWitness := fmt.Sprintf("%08x", numInputs) + witnessString
	log.Println("full witness:", fullWitness)

	// Convert hex string to decoded bytes
	encodedHex, err := hex.DecodeString(fullWitness)
	return encodedHex, err
}
