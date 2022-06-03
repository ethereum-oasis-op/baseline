package circuitlib

import (
	"bytes"
	"encoding/hex"
	"fmt"
	"io"
	"zkcircuit/json"

	"github.com/consensys/gnark-crypto/ecc"
	"github.com/consensys/gnark/backend"
	"github.com/consensys/gnark/backend/groth16"
	"github.com/consensys/gnark/frontend"
	"github.com/consensys/gnark/std/hash/mimc"
)

type OrderCircuit struct {
	I  Input
	PI PrivateInput
}

type Input struct {
	AgreementStateCommitment frontend.Variable `gnark:",public"`
	StateObjectCommitment    frontend.Variable `gnark:",public"`
	CalculatedAgreementRoot  frontend.Variable `gnark:",public"`
}

type PrivateInput struct {
	O                  Order
	OrderRoot          frontend.Variable `gnark:",secret"`
	OrderSalt          frontend.Variable `gnark:",secret"`
	BuyerPK            frontend.Variable `gnark:",secret"`
	AgreementStateRoot frontend.Variable `gnark:",secret"`
	AgreementStateSalt frontend.Variable `gnark:",secret"`
}

type Order struct {
	ProductId frontend.Variable `gnark:",secret"`
	BuyerSig  frontend.Variable `gnark:",secret"`
}

var verifyingKey string

func (circuit *OrderCircuit) Define(api frontend.API) error {
	mimc, err := mimc.NewMiMC(api)
	if err != nil {
		fmt.Println(err, "New MiMC instantiation failed")
		return nil
	}

	// Asserts Input AgreementStateCommitment and Derived AgreementStateCommitment are equal
	sum := api.Add(circuit.PI.AgreementStateRoot, circuit.PI.AgreementStateSalt)
	mimc.Write(sum)
	// api.AssertIsEqual(circuit.I.AgreementStateCommitment, mimc.Sum())
	api.AssertIsEqual(circuit.I.AgreementStateCommitment, sum)

	// Asserts Input StateObjectCommitment and Derived StateObjectCommitment are equal
	mimc.Reset()
	sum = api.Add(circuit.PI.OrderRoot, circuit.PI.OrderSalt)
	mimc.Write(sum)
	// api.AssertIsEqual(circuit.I.StateObjectCommitment, mimc.Sum())
	api.AssertIsEqual(circuit.I.StateObjectCommitment, sum)

	//Asserts CalculatedAgreementRoot and PrivateInput AgreementStateRoot are equal
	api.AssertIsEqual(circuit.I.CalculatedAgreementRoot, circuit.PI.AgreementStateRoot)

	//Verifies Signature is correct - mimics mock fashion
	api.AssertIsEqual(circuit.PI.O.BuyerSig, api.Add(circuit.PI.BuyerPK, circuit.PI.O.ProductId))

	return nil
}

func GenerateProof(p json.OrderCircuitInput) (groth16.Proof, error) {
	var zkcircuit OrderCircuit

	r1cs, err := frontend.Compile(ecc.BN254, backend.GROTH16, &zkcircuit)
	if err != nil {
		return nil, err
	}

	assignment := assignCircuitInputs(p)
	witness, err := frontend.NewWitness(assignment, ecc.BN254)
	if err != nil {
		return nil, err
	}

	pk, vk, err := groth16.Setup(r1cs)
	if err != nil {
		return nil, err
	}

	buf := new(bytes.Buffer)
	_, err = vk.(io.WriterTo).WriteTo(buf)
	if err != nil {
		return nil, err
	}
	verifyingKey = hex.EncodeToString(buf.Bytes())

	proof, err := groth16.Prove(r1cs, pk, witness)
	if err != nil {
		return nil, err
	} else {
		return proof, nil
	}
}

func VerifyProof(v json.OrderCircuitInput, proof interface{}) error {
	assignment := assignCircuitInputs(v)

	witness, _ := frontend.NewWitness(assignment, ecc.BN254)
	publicWitness, err := witness.Public()
	if err != nil {
		return err
	}

	vk, err := hex.DecodeString(verifyingKey)
	if err != nil {
		return err
	}

	_vk, err := DeserializeVerifyingKey(vk)
	if err != nil {
		return err
	}

	err = groth16.Verify(proof.(groth16.Proof), _vk.(groth16.VerifyingKey), publicWitness)
	if err != nil {
		return err
	} else {
		return nil
	}
}

func assignCircuitInputs(p json.OrderCircuitInput) *OrderCircuit {
	assignment := &OrderCircuit{
		I: Input{
			AgreementStateCommitment: p.AgreementStateCommitment,
			StateObjectCommitment:    p.StateObjectCommitment,
			CalculatedAgreementRoot:  p.CalculatedAgreementRoot,
		},
		PI: PrivateInput{
			O: Order{
				BuyerSig:  p.BuyerSig,
				ProductId: p.ProductId,
			},
			OrderRoot:          p.OrderRoot,
			OrderSalt:          p.OrderSalt,
			BuyerPK:            p.BuyerPK,
			AgreementStateRoot: p.AgreementStateRoot,
			AgreementStateSalt: p.AgreementStateSalt,
		},
	}
	return assignment
}

func DeserializeProof(_prf []byte) (interface{}, error) {
	var prf interface{}
	var err error

	prf = groth16.NewProof(ecc.BN254)
	_, err = prf.(groth16.Proof).ReadFrom(bytes.NewReader(_prf))

	if err != nil {
		fmt.Println(err)
		return nil, err
	}

	return prf, nil
}

func DeserializeVerifyingKey(_vk []byte) (interface{}, error) {
	var vk interface{}
	var err error

	vk = groth16.NewVerifyingKey(ecc.BN254)
	_, err = vk.(groth16.Proof).ReadFrom(bytes.NewReader(_vk))

	if err != nil {
		fmt.Println(err)
		return nil, err
	}

	return vk, nil
}
