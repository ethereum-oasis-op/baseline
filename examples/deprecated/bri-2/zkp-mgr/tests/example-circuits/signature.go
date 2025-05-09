ppackage main

import (
	"encoding/hex"
	
	"github.com/consensys/gnark-crypto/ecc"
	eddsa_gen "github.com/consensys/gnark-crypto/ecc/bn254/twistededwards/eddsa"
	"github.com/consensys/gnark/frontend"
	"github.com/consensys/gnark/std/algebra/twistededwards"
	eddsa_circuit "github.com/consensys/gnark/std/signature/eddsa"
)

// Circuit input definitions
type Circuit struct {
	// struct tags on a variable is optional
	// default uses variable name and secret visibility.
	NewCommit  frontend.Variable `gnark:",public"`
	Sig0 eddsa_circuit.Signature   `gnark:",private"`
}

// Define declares the circuit constraints
func (circuit *Circuit) Define(curveID ecc.ID, cs *frontend.ConstraintSystem) error {
	var err error
	var params twistededwards.EdCurve

	/***** Check for signature by pubKey_0 *****/
	var pubKeyString_0 = "4bd3822517db41e55a9d234187b22215187d20ba37d83208ddc7788dc473f31e"
	var pubKeyGen_0 eddsa_gen.PublicKey
	var pubKeyCircuit_0 eddsa_circuit.PublicKey
	pubKeyBytes_0, _ := hex.DecodeString(pubKeyString_0)
	_, err = pubKeyGen_0.SetBytes(pubKeyBytes_0)
	if err != nil {
		return err
	}
	pubKeyCircuit_0.A.X = cs.Constant(pubKeyGen_0.A.X)
	pubKeyCircuit_0.A.Y = cs.Constant(pubKeyGen_0.A.Y)

	// Prepare for signature check
	params, err = twistededwards.NewEdCurve(ecc.BN254)
	if err != nil {
		return err
	}
	pubKeyCircuit_0.Curve = params

	// Check for signature on hash
	if err = eddsa_circuit.Verify(cs, circuit.Sig0, circuit.NewCommit, pubKeyCircuit_0); err != nil {
    return err
	}

	return nil
}
