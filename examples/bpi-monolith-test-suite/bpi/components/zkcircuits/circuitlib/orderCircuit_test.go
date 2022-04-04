package circuitlib

import (
	"os"
	"testing"

	"github.com/consensys/gnark-crypto/ecc"
	"github.com/consensys/gnark/backend"
	"github.com/consensys/gnark/backend/groth16"
	"github.com/consensys/gnark/frontend"
)

const (
	r1csPath     = "../ordercircuit/order.r1cs"
	pkPath       = "../ordercircuit/order.pk"
	vkPath       = "../ordercircuit/order.vk"
	solidityPath = "../ordercircuit/order.sol"
)

func TestOrderCircuit(t *testing.T) {

	var zkcircuit OrderCircuit
	var err error

	r1cs, err := frontend.Compile(ecc.BN254, backend.GROTH16, &zkcircuit)

	if err != nil {
		t.Fatal(err)
	}

	f, err := os.Create(r1csPath)
	if err != nil {
		t.Fatal(err)
	}

	_, err = r1cs.WriteTo(f)
	if err != nil {
		t.Fatal(err)
	}

	pk, vk, err := groth16.Setup(r1cs)
	if err != nil {
		t.Fatal(err)
	}

	f, err = os.Create(pkPath)
	if err != nil {
		t.Fatal(err)
	}

	_, err = pk.WriteTo(f)
	if err != nil {
		t.Fatal(err)
	}

	f, err = os.Create(vkPath)
	if err != nil {
		t.Fatal(err)
	}

	_, err = vk.WriteTo(f)
	if err != nil {
		t.Fatal(err)
	}

	f, err = os.Create(solidityPath)
	if err != nil {
		t.Fatal(err)
	}

	err = vk.ExportSolidity(f)
	if err != nil {
		t.Fatal(err)
	}
}
