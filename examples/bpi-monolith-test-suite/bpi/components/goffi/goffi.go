package main

import "C"

import (
	"fmt"
	"log"

	"github.com/consensys/gnark-crypto/ecc"
	"github.com/consensys/gnark/backend"
	"github.com/consensys/gnark/backend/groth16"
	"github.com/consensys/gnark/frontend"
	"github.com/consensys/gnark/std/hash/mimc"
)

var InvalidProof = "Invalid Proof!"
var ValidProof = "Valid Proof!"

func main() {}

type Circuit struct {
	I  Input
	PI PrivateInput
}

type Input struct {
	AgreementStateCommitment frontend.Variable `gnark:",public"`
	StateObjectCommitment    frontend.Variable `gnark:",public"`
}

type PrivateInput struct {
	Order          frontend.Variable `gnark:",secret"`
	OrderSalt      frontend.Variable `gnark:",secret"`
	ProductIdsRoot frontend.Variable `gnark:",secret"`
	// ProductIdsProof    frontend.Variable `gnark:",secret"`
	BuyerPK            frontend.Variable `gnark:",secret"`
	SellerPK           frontend.Variable `gnark:",secret"`
	AgreementStateRoot frontend.Variable `gnark:",secret"`
	AgreementStateSalt frontend.Variable `gnark:",secret"`
	// 	// salt               frontend.Variable `gnark:"secret"`
}

func (circuit *Circuit) Define(api frontend.API) error {
	mimc, _ := mimc.NewMiMC(api)

	mimc.Write(api.Add(circuit.PI.AgreementStateRoot, circuit.PI.AgreementStateSalt))
	api.AssertIsEqual(circuit.I.AgreementStateCommitment, mimc.Sum())

	mimc.Reset()
	mimc.Write(api.Add(circuit.PI.Order, circuit.PI.OrderSalt))
	api.AssertIsEqual(circuit.I.StateObjectCommitment, mimc.Sum())

	api.AssertIsEqual(circuit.PI.BuyerPK, 1)
	api.AssertIsEqual(circuit.PI.SellerPK, 1)
	api.AssertIsEqual(circuit.PI.ProductIdsRoot, 1)

	api.AssertIsEqual(1, circuit.PI.AgreementStateRoot)

	//verify Signature
	// valid &&= verifySig(
	// 	privateInput.order.productId,
	// 	privateInput.order.buyerSig,
	// 	privateInput.buyerPK
	// )

	//Verify order productId existence on merkle tree
	// valid &&= MerkleTree.verify(
	// 	privateInput.productIdsProof,
	// 	sha256(privateInput.order.productId).toString(),
	// 	privateInput.productIdsRoot
	// )
	return nil
}

//export runcircuit
func runcircuit(ASC, SO string) string {
	defer func() {
		if r := recover(); r != nil {
			fmt.Println("Recovered in f", r)
		}
	}()
	var zkcircuit Circuit
	r1cs, err := frontend.Compile(ecc.BN254, backend.GROTH16, &zkcircuit)
	if err != nil {
		log.Fatal(err)
	}

	// generating pk, vk
	pk, vk, err := groth16.Setup(r1cs)
	assignment := &Circuit{
		I: Input{
			AgreementStateCommitment: ASC,
			StateObjectCommitment:    SO,
		},
		PI: PrivateInput{
			Order:          "1",
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
	proof, err := groth16.Prove(r1cs, pk, witness)
	publicWitness, err := witness.Public()
	err = groth16.Verify(proof, vk, publicWitness)
	if err != nil {
		return InvalidProof
	} else {
		return ValidProof
	}
}

// AgreementStateCommitment: "14148558618612511066119773842969464723224450289245446087478928843598143811659",
// StateObjectCommitment:    "3809531659786630799763432231414721345625774896241005522309640398181762968274",
