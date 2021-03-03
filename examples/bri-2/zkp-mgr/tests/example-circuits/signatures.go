package main

import (
	"github.com/consensys/gnark/frontend"
	"github.com/consensys/gnark/std/algebra/twistededwards"
	"github.com/consensys/gnark/std/hash/mimc"
	"github.com/consensys/gnark/std/signature/eddsa"
	"github.com/consensys/gurvy"
)

// Circuit input definitions
type Circuit struct {
	// struct tags on a variable is optional
	// default uses variable name and secret visibility.
	NewCommit  frontend.Variable `gnark:",public"`
	PrevCommit frontend.Variable `gnark:",public"`
	ObjectHash frontend.Variable `gnark:",private"`
	Salt       frontend.Variable `gnark:",private"`
	Sig1       eddsa.Signature   `gnark:",private"`
	Sig2       eddsa.Signature   `gnark:",private"`
}

var pubKey1 eddsa.PublicKey
var pubKey2 eddsa.PublicKey

// Define declares the circuit constraints
func (circuit *Circuit) Define(curveID gurvy.ID, cs *frontend.ConstraintSystem) error {
	// Prepare for signature checks
	params, err := twistededwards.NewEdCurve(gurvy.BN256)
	if err != nil {
		return err
	}

	// Check that PubKey1 has signed the NewCommit
	pubKey1.Curve = params
	if err = eddsa.Verify(cs, circuit.Sig1, circuit.NewCommit, pubKey1); err != nil {
		return err
	}

	// Check that PubKey2 has signed the NewCommit
	pubKey2.Curve = params
	if err = eddsa.Verify(cs, circuit.Sig2, circuit.NewCommit, pubKey2); err != nil {
		return err
	}

	// Check that NewCommit == Hash(Salt, PrevCommit, ObjectHash)
	mimc, _ := mimc.NewMiMC("seed", curveID)
	cs.AssertIsEqual(circuit.NewCommit, mimc.Hash(cs, circuit.Salt, circuit.PrevCommit, circuit.ObjectHash))

	return nil
}
