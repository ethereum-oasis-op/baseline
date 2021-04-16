package main

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
	// default uses variable name and secret visibility.
	NewCommit frontend.Variable       `gnark:",public"`
	Sig0      eddsa_circuit.Signature `gnark:",private"`
}

// Define declares the circuit constraints
func (circuit *Circuit) Define(curveID gurvy.ID, cs *frontend.ConstraintSystem) error {
	// Convert eddsa_gen.PublicKey into eddsa_circuit.PublicKey
	var pubKeyString_0 = "f5f2741d06ab0d802b68ddfe4461c09a44f04d4fa22cf77c891d7d7b3d575a16"
	var pubKeyGen_0 eddsa_gen.PublicKey
	var pubKeyCircuit_0 eddsa_circuit.PublicKey
	pubKeyBytes_0, _ := hex.DecodeString(pubKeyString_0)
	_, err := pubKeyGen_0.SetBytes(pubKeyBytes_0)
	if err != nil {
		return err
	}

	pubKeyCircuit_0.A.X = cs.Constant(pubKeyGen_0.A.X)
	pubKeyCircuit_0.A.Y = cs.Constant(pubKeyGen_0.A.Y)

	// Prepare for signature checks
	params, err := twistededwards.NewEdCurve(gurvy.BN256)
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
