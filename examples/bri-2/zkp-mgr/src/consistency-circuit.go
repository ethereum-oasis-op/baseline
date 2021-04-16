package main

import (
	"encoding/hex"
	"io/ioutil"
	"log"
	"strconv"

	eddsa_gen "github.com/consensys/gnark-crypto/ecc/bn254/twistededwards/eddsa"
)

// Creates a Zk-circuit source code file (uncompiled.go) that checks for
// signatures from the supplied eddsa public keys
func generateConsistencyCircuit(circuitId string, identities []string) {
	log.Println("Received request to create new consistency circuit:", circuitId)

	fileContents := `package main

import (
	"github.com/consensys/gnark/frontend"
	"github.com/consensys/gnark/std/algebra/twistededwards"
	"github.com/consensys/gnark/std/signature/eddsa"
	"github.com/consensys/gurvy"
)

// Circuit input definitions
type Circuit struct {
	// struct tags on a variable is optional
	// default uses variable name and secret visibility.` +
		"\n\tNewCommit  frontend.Variable `gnark:\",public\"`\n"

	var privateInputs string
	var publicKeys string
	var sigChecks string

	for index, identity := range identities {
		// Convert identities from strings of public keys to eddsa.PublicKey
		var pk0 eddsa_gen.PublicKey
		//var circuit_pk0 eddsa.PublicKey
		identityBytes, _ := hex.DecodeString(identity)
		pk0.SetBytes(identityBytes)

		indexStr := strconv.Itoa(index)

		privateInputs += "\tSig" + indexStr + " eddsa.Signature   `gnark:\",private\"`\n"
		publicKeys += "\nvar pubKey" + indexStr + " = " + string(pk0.Bytes())
		sigChecks += "\n\tpubKey" + indexStr + ".Curve = params\n" +
			"\tif err = eddsa.Verify(cs, circuit.Sig" + indexStr + ", circuit.NewCommit, pubKey" + indexStr + `); err != nil {
		return err
	}` + "\n"
	}

	fileContents += privateInputs + "}" + "\n" + publicKeys + "\n\n"
	fileContents += `// Define declares the circuit constraints
func (circuit *Circuit) Define(curveID gurvy.ID, cs *frontend.ConstraintSystem) error {
	// Prepare for signature checks
	params, err := twistededwards.NewEdCurve(gurvy.BN256)
	if err != nil {
		return err
	}` + "\n"

	fileContents += sigChecks + "\n\t" + `return nil
}`

	fileBytes := []byte(fileContents)
	destinationFile := "src/circuits/" + circuitId + "/uncompiled.go"

	err := ioutil.WriteFile(destinationFile, fileBytes, 0644)
	if err != nil {
		log.Println("ERROR creating file: " + err.Error())
		return
	}
	log.Println("Created new file: " + destinationFile)

}
