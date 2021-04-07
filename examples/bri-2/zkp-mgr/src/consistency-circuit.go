package main

import (
	"io/ioutil"
	"log"
	"strconv"
)

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
		indexStr := strconv.Itoa(index)
		privateInputs += "\tSig" + indexStr + " eddsa.Signature   `gnark:\",private\"`\n"
		publicKeys += "\nvar pubKey" + indexStr + " = \"" + identity + "\""
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
	destinationFile := "src/circuits/uncompiled/" + circuitId + ".go"

	err := ioutil.WriteFile(destinationFile, fileBytes, 0644)
	if err != nil {
		log.Fatal("Error creating file: " + err.Error())
	}
	log.Println("Created new file: " + destinationFile)

}
