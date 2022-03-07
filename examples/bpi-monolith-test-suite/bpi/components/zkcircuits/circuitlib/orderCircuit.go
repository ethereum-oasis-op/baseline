package circuitlib

import (
	"fmt"
	"log"

	"github.com/consensys/gnark-crypto/ecc"
	"github.com/consensys/gnark/backend"
	"github.com/consensys/gnark/backend/groth16"
	"github.com/consensys/gnark/frontend"
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
	ProductId frontend.Variable `gnark:","`
	BuyerSig  frontend.Variable `gnark:","`
}

func (circuit *Circuit) Define(api frontend.API) error {
	// mimc, _ := mimc.NewMiMC(api)

	//Asserts Input AgreementStateCommitment and Derived AgreementStateCommitment are equal
	sum := api.Add(circuit.PI.AgreementStateRoot, circuit.PI.AgreementStateSalt)
	api.AssertIsEqual(circuit.I.AgreementStateCommitment, sum)

	//Asserts Input StateObjectCommitment and Derived StateObjectCommitment are equal
	sum = api.Add(circuit.PI.OrderRoot, circuit.PI.OrderSalt)
	api.AssertIsEqual(circuit.I.StateObjectCommitment, sum)

	//Asserts CalculatedAgreementRoot and PrivateInput AgreementStateRoot are equal
	api.AssertIsEqual(circuit.I.CalculatedAgreementRoot, circuit.PI.AgreementStateRoot)

	//Verifies Signature is correct - mimics mock fashion
	api.AssertIsEqual(circuit.PI.O.BuyerSig, api.Add(circuit.PI.BuyerPK, circuit.PI.O.ProductId))

	return nil
}

func GenerateProof(ASC, SOC string) (groth16.Proof, string) {
	var zkcircuit Circuit
	r1cs, err := frontend.Compile(ecc.BN254, backend.GROTH16, &zkcircuit)
	if err != nil {
		fmt.Println(err)
		return nil, "Invalid circuit compilation"
	}

	assignment := &Circuit{
		I: Input{
			AgreementStateCommitment: ASC,
			StateObjectCommitment:    SOC,
			CalculatedAgreementRoot:  "1",
		},
		PI: PrivateInput{
			O: Order{
				BuyerSig:  "2",
				ProductId: "1",
			},
			OrderRoot:          "1",
			OrderSalt:          "1",
			BuyerPK:            "1",
			AgreementStateRoot: "1",
			AgreementStateSalt: "1",
		},
	}

	witness, _ := frontend.NewWitness(assignment, ecc.BN254)
	fmt.Println(witness)

	pk, _, err := groth16.Setup(r1cs)
	if err != nil {
		fmt.Println(err)
		return nil, "Invalid Groth16 setup"
	}

	proof, err := groth16.Prove(r1cs, pk, witness)
	if err != nil {
		fmt.Println(err)
		return nil, "Invalid Proof"
	} else {
		return proof, ""
	}
}

func VerifyProof(ASC, SOC string, proof groth16.Proof) string {
	var zkcircuit Circuit
	r1cs, err := frontend.Compile(ecc.BN254, backend.GROTH16, &zkcircuit)
	if err != nil {
		log.Fatal(err)
	}
	fmt.Println(ASC)
	fmt.Println(SOC)
	fmt.Println(proof)

	fmt.Println(r1cs)
	// generating pk, vk
	assignment := &Circuit{
		I: Input{
			AgreementStateCommitment: ASC,
			StateObjectCommitment:    SOC,
			CalculatedAgreementRoot:  "1",
		},
		PI: PrivateInput{
			O: Order{
				BuyerSig:  "2",
				ProductId: "1",
			},
			OrderRoot:          "1",
			OrderSalt:          "1",
			BuyerPK:            "1",
			AgreementStateRoot: "1",
			AgreementStateSalt: "1",
		},
	}

	witness, _ := frontend.NewWitness(assignment, ecc.BN254)
	publicWitness, err := witness.Public()
	if err != nil {
		fmt.Println(err)
		return "Invalid Public Witness!"
	}

	_, vk, err := groth16.Setup(r1cs)
	if err != nil {
		fmt.Println(err)
		return "Invalid Groth16 setup"
	}

	err = groth16.Verify(proof, vk, publicWitness)
	if err != nil {
		fmt.Println(err)
		return "Invalid verification!"
	} else {
		return "Valid Proof"
	}
}
