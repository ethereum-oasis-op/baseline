package main

import (
	"os"

	"github.com/consensys/gnark-crypto/ecc"
	"github.com/consensys/gnark/backend"
	"github.com/consensys/gnark/frontend"
)

func main() {
	var circuit Circuit

	// compiles our circuit into a R1CS
	r1cs, err := frontend.Compile(ecc.BN254, backend.GROTH16, &circuit)
	if err != nil {
		panic(err)
	}

	// save the R1CS to disk
	file, err := os.Create("circuit.r1cs")
	if err != nil {
		panic(err)
	}

	if _, err := r1cs.WriteTo(file); err != nil {
		panic(err)
	}
}
