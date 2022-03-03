package circuitlib

import (
	"fmt"
	"log"

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
	O              Order
	OrderSalt      frontend.Variable `gnark:",secret"`
	ProductIdsRoot frontend.Variable `gnark:",secret"`
	// ProductIdsProof    frontend.Variable `gnark:",secret"`
	BuyerPK            frontend.Variable `gnark:",secret"`
	SellerPK           frontend.Variable `gnark:",secret"`
	AgreementStateRoot frontend.Variable `gnark:",secret"`
	AgreementStateSalt frontend.Variable `gnark:",secret"`
	// 	// salt               frontend.Variable `gnark:"secret"`
}

type Order struct {
	ProductId frontend.Variable `gnark:","`
	BuyerSig  frontend.Variable `gnark:","`
	// SellerSig frontend.Variable `gnark:","`
}

func (circuit *Circuit) Define(api frontend.API) error {
	mimc, _ := mimc.NewMiMC(api)

	//Asserts Input AgreementStateCommitment and Derived AgreementStateCommitment are equal
	mimc.Write(api.Add(circuit.PI.AgreementStateRoot, circuit.PI.AgreementStateSalt))
	api.AssertIsEqual(circuit.I.AgreementStateCommitment, mimc.Sum())

	//Asserts Input StateObjectCommitment and Derived StateObjectCommitment are equal
	mimc.Reset()
	mimc.Write(api.Add(circuit.PI.O, circuit.PI.OrderSalt))
	api.AssertIsEqual(circuit.I.StateObjectCommitment, mimc.Sum())

	//Asserts CalculatedAgreementRoot and PrivateInput AgreementStateRoot are equal
	// t := makeMerkle(circuit.PI.BuyerPK, circuit.PI.SellerPK, circuit.PI.ProductIdsRoot)
	api.AssertIsEqual(circuit.I.CalculatedAgreementRoot, circuit.PI.AgreementStateRoot)

	//Verifies Signature is correct - mimics mock fashion
	api.AssertIsEqual(circuit.PI.O.BuyerSig, api.Add(circuit.PI.BuyerPK, circuit.PI.O.ProductId))

	//Verify order productId existence on merkle tree
	// valid &&= MerkleTree.verify(
	// 	privateInput.productIdsProof,
	// 	sha256(privateInput.order.productId).toString(),
	// 	privateInput.productIdsRoot
	// )
	return nil
}

func CallCircuit(ASC, SOC string) string {
	var zkcircuit Circuit
	r1cs, err := frontend.Compile(ecc.BN254, backend.GROTH16, &zkcircuit)
	if err != nil {
		log.Fatal(err)
	}

	// generating pk, vk
	assignment := &Circuit{
		I: Input{
			AgreementStateCommitment: ASC,
			StateObjectCommitment:    SOC,
		},
		PI: PrivateInput{
			O: Order{
				BuyerSig:  "1",
				ProductId: "1",
			},
			OrderSalt:      "1",
			ProductIdsRoot: "1",
			// ProductIdsProof:    "1",
			BuyerPK:            "1",
			SellerPK:           "1",
			AgreementStateRoot: "2949184495810935975451379703263371301616947997738438967827477104837682885816",
			AgreementStateSalt: "1",
		},
	}

	witness, _ := frontend.NewWitness(assignment, ecc.BN254)
	publicWitness, err := witness.Public()
	if err != nil {
		fmt.Println(err)
		return "Invalid Public Witness!"
	}

	pk, vk, err := groth16.Setup(r1cs)
	if err != nil {
		fmt.Println(err)
		return "Invalid Groth16 setup"
	}

	proof, err := groth16.Prove(r1cs, pk, witness)
	if err != nil {
		fmt.Println(err)
		return "Invalid Proof"
	}

	err = groth16.Verify(proof, vk, publicWitness)
	if err != nil {
		fmt.Println(err)
		return "Invalid verification!"
	} else {
		return "Valid Proof"
	}
}
