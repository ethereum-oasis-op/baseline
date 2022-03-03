package cubic

import (
	"fmt"
	"log"

	"github.com/consensys/gnark-crypto/ecc"
	"github.com/consensys/gnark/backend"
	"github.com/consensys/gnark/backend/groth16"
	"github.com/consensys/gnark/frontend"
)

// Circuit defines a simple circuit
// x**3 + x + 5 == y
type Circuit struct {
	// struct tags on a variable is optional
	// default uses variable name and secret visibility.
	X frontend.Variable `gnark:"x"`
	Y frontend.Variable `gnark:",public"`
}

// Define declares the circuit constraints
// x**3 + x + 5 == y
func (circuit *Circuit) Define(api frontend.API) error {
	x3 := api.Mul(circuit.X, circuit.X, circuit.X)
	api.AssertIsEqual(circuit.Y, api.Add(x3, circuit.X, 5))
	return nil
}

func CallCubicCircuit(a, b string) string {
	var zkcircuit Circuit
	r1cs, err := frontend.Compile(ecc.BN254, backend.GROTH16, &zkcircuit)
	if err != nil {
		log.Fatal(err)
	}

	// generating pk, vk
	assignment := &Circuit{
		X: 42,
		Y: 42,
	}

	witness, _ := frontend.NewWitness(assignment, ecc.BN254)
	publicWitness, err := witness.Public()
	pk, vk, err := groth16.Setup(r1cs)
	proof, err := groth16.Prove(r1cs, pk, witness)
	err = groth16.Verify(proof, vk, publicWitness)
	if err != nil {
		fmt.Println(err)
		return "INVALID PROOF!"
	} else {
		return "VALID PROOF"
	}
}
