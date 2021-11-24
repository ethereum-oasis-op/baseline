package main

import (
	"bytes"
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
	var fieldElements uint32
	var witnessString string

	for _, input := range inputs {
		log.Printf("Processing input: %+v", input)
		var hexInput string

		// Handle input conversions differently based on type
		switch input.InputType {
		case "signature":
			log.Println("signature input:", input.Value)
			strippedInput := strip0x(input.Value)
			log.Println("stripped input:", strippedInput)
			sigHex, err := hex.DecodeString(strippedInput)
			if err != nil {
				return nil, err
			}

			// Convert from hex string to eddsa signature struct
			var sig eddsa_gen.Signature
			sig.SetBytes(sigHex)

			var buf bytes.Buffer
			var padding [16]byte

			rxBytes := sig.R.X.Bytes()
			ryBytes := sig.R.Y.Bytes()

			//binary.Write(&buf, binary.BigEndian, uint32(5))
			buf.Write(rxBytes[:])
			buf.Write(ryBytes[:])
			buf.Write(padding[:])
			buf.Write(sig.S[:16])
			buf.Write(padding[:])
			buf.Write(sig.S[16:])

			hexInput = hex.EncodeToString(buf.Bytes())
			fieldElements += 4
		case "hash":
			log.Println("hash input:", input.Value)
			// TODO: Pad hash with zeros?
			hexInput = strip0x(input.Value)
			fieldElements++
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
			fieldElements++
		}

		// Update counters
		witnessString += hexInput
		log.Printf("witnessString: %s", witnessString)
	}

	// Convert number of field elements to hex of uint32
	fullWitness := fmt.Sprintf("%08x", fieldElements) + witnessString
	log.Println("full witness:", fullWitness)

	// Convert hex string to decoded bytes
	encodedHex, err := hex.DecodeString(fullWitness)
	return encodedHex, err
}

/************************************************************************/
/** Helper function to strip off "0x" if it is prefixed to a string    **/
/************************************************************************/
func strip0x(hexInput string) string {
	if hexInput[:2] == "0x" || hexInput[:2] == "0X" {
		return hexInput[2:]
	}
	return hexInput
}
