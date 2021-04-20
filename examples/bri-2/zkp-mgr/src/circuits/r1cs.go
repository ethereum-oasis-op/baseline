package main

import (
	"os"

	"github.com/consensys/gnark/backend"
	"github.com/consensys/gnark/frontend"
	"github.com/consensys/gurvy"
)

func main() {
	var circuit Circuit

	// compiles our circuit into a R1CS
	r1cs, err := frontend.Compile(gurvy.BN256, backend.GROTH16, &circuit)
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
