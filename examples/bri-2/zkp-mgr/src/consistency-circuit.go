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
		"encoding/hex"
	
		eddsa_gen "github.com/consensys/gnark-crypto/ecc/bn254/twistededwards/eddsa"
		"github.com/consensys/gnark/frontend"
		"github.com/consensys/gnark/std/algebra/twistededwards"
		eddsa_circuit "github.com/consensys/gnark/std/signature/eddsa"
		"github.com/consensys/gurvy"
	)

// Circuit input definitions
type Circuit struct {
	// struct tags on a variable is optional
	// default uses variable name and secret visibility.` +
		"\n\tNewCommit  frontend.Variable `gnark:\",public\"`\n"

	var privateInputs string
	var sigChecks string

	for index, identity := range identities {
		// Convert identities from strings of public keys to eddsa.PublicKey
		var pk0 eddsa_gen.PublicKey
		//var circuit_pk0 eddsa.PublicKey
		identityBytes, _ := hex.DecodeString(identity)
		pk0.SetBytes(identityBytes)

		indexStr := strconv.Itoa(index)

		privateInputs += "\tSig" + indexStr + " eddsa_circuit.Signature   `gnark:\",private\"`\n"
		sigChecks += "\n\t/***** Check for signature by pubKey_" + indexStr + " *****/" +
			"\n\tvar pubKeyString_" + indexStr + " = \"" + identity + "\"" +
			"\n\tvar pubKeyGen_" + indexStr + " eddsa_gen.PublicKey" +
			"\n\tvar pubKeyCircuit_" + indexStr + " eddsa_circuit.PublicKey" +
			"\n\tpubKeyBytes_" + indexStr + ", _ := hex.DecodeString(pubKeyString_" + indexStr + ")" +
			"\n\t_, err = pubKeyGen_" + indexStr + ".SetBytes(pubKeyBytes_" + indexStr + ")\n\t" + `if err != nil {
		return err
	}` +
			"\n\tpubKeyCircuit_" + indexStr + ".A.X = cs.Constant(pubKeyGen_" + indexStr + ".A.X)" +
			"\n\tpubKeyCircuit_" + indexStr + ".A.Y = cs.Constant(pubKeyGen_" + indexStr + ".A.Y)" +
			"\n\n\t" + `// Prepare for signature check
	params, err = twistededwards.NewEdCurve(gurvy.BN256)
	if err != nil {
		return err
	}` +
			"\n\tpubKeyCircuit_" + indexStr + ".Curve = params" +
			"\n\n\t// Check for signature on hash" +
			"\n\tif err = eddsa_circuit.Verify(cs, circuit.Sig" + indexStr + ", circuit.NewCommit, pubKeyCircuit_" + indexStr + "); err != nil {\n" +
			`    return err
	}` + "\n"
	}

	// Append code segments to fileContents
	fileContents += privateInputs + "}" + "\n\n"
	fileContents += `// Define declares the circuit constraints
func (circuit *Circuit) Define(curveID gurvy.ID, cs *frontend.ConstraintSystem) error {
	var err error
	var params twistededwards.EdCurve` + "\n"

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
