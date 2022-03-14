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

type Circuit struct {
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

func (circuit *Circuit) Define(api frontend.API) error {
	mimc, _ := mimc.NewMiMC(api)

	//Asserts Input AgreementStateCommitment and Derived AgreementStateCommitment are equal
	sum := api.Add(circuit.PI.AgreementStateRoot, circuit.PI.AgreementStateSalt)
	mimc.Write(sum)
	api.AssertIsEqual(circuit.I.AgreementStateCommitment, mimc.Sum())

	//Asserts Input StateObjectCommitment and Derived StateObjectCommitment are equal
	mimc.Reset()
	sum = api.Add(circuit.PI.OrderRoot, circuit.PI.OrderSalt)
	mimc.Write(sum)
	api.AssertIsEqual(circuit.I.StateObjectCommitment, mimc.Sum())

	//Asserts CalculatedAgreementRoot and PrivateInput AgreementStateRoot are equal
	api.AssertIsEqual(circuit.I.CalculatedAgreementRoot, circuit.PI.AgreementStateRoot)

	//Verifies Signature is correct - mimics mock fashion
	api.AssertIsEqual(circuit.PI.O.BuyerSig, api.Add(circuit.PI.BuyerPK, circuit.PI.O.ProductId))

	return nil
}

func GenerateProof(p json.Input) (groth16.Proof, string) {
	var zkcircuit Circuit

	r1cs, err := frontend.Compile(ecc.BN254, backend.GROTH16, &zkcircuit)
	if err != nil {
		fmt.Println(err)
		return nil, "Invalid circuit compilation"
	}

	assignment := assign(p)
	witness, err := frontend.NewWitness(assignment, ecc.BN254)
	if err != nil {
		fmt.Println(err)
		return nil, "Witness Creation Failed!"
	}

	pk, vk, err := groth16.Setup(r1cs)
	if err != nil {
		fmt.Println(err)
		return nil, "Groth16 Setup Failed!"
	}

	buf := new(bytes.Buffer)
	_, err = vk.(io.WriterTo).WriteTo(buf)
	verifyingKey = hex.EncodeToString(buf.Bytes())

	proof, err := groth16.Prove(r1cs, pk, witness)
	if err != nil {
		fmt.Println(err)
		return nil, "Proof Creation Failed!"
	} else {
		return proof, ""
	}
}

func VerifyProof(v json.Input, proof interface{}) string {
	assignment := assign(v)

	witness, _ := frontend.NewWitness(assignment, ecc.BN254)
	publicWitness, err := witness.Public()
	if err != nil {
		fmt.Println(err)
		return "Witness Creation Failed!"
	}

	vk, err := hex.DecodeString(verifyingKey)
	if err != nil {
		fmt.Println(err)
		return "Verifying Key Decoding Failed!"
	}

	_vk, err := DeserializeVerifyingKey(vk)
	if err != nil {
		fmt.Println(err)
		return "Verifying Key Deserialization Failed!"
	}

	err = groth16.Verify(proof.(groth16.Proof), _vk.(groth16.VerifyingKey), publicWitness)
	if err != nil {
		fmt.Println(err)
		return "Invalid verification!"
	} else {
		return "Valid Proof"
	}
}

func assign(p json.Input) *Circuit {
	assignment := &Circuit{
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
