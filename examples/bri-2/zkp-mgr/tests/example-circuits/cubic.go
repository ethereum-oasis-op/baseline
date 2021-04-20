package main

import (
	"github.com/consensys/gnark/frontend"
	"github.com/consensys/gurvy"
)

// Circuit input definitions
type Circuit struct {
	// struct tags on a variable is optional
	// default uses variable name and secret visibility.
	Y frontend.Variable `gnark:",public"`
	X frontend.Variable `gnark:"x"`
}

// Define declares the circuit constraints
// x**3 + x + 5 == y
func (circuit *Circuit) Define(curveID gurvy.ID, cs *frontend.ConstraintSystem) error {
	x3 := cs.Mul(circuit.X, circuit.X, circuit.X)
	cs.AssertIsEqual(circuit.Y, cs.Add(x3, circuit.X, 5))
	return nil
}
