package main

import (
	"crypto/sha256"
	"fmt"
	"log"
	"syscall/js"

	"github.com/cbergoon/merkletree"
	"github.com/consensys/gnark-crypto/ecc"
	"github.com/consensys/gnark/backend"
	"github.com/consensys/gnark/backend/groth16"
	"github.com/consensys/gnark/frontend"
	"github.com/consensys/gnark/std/hash/mimc"
)

// func GetHtml() js.Func {
// 	return js.FuncOf(func(this js.Value, args []js.Value) interface{} {
// 		return runcircuit()
// 	})
// }

var invalidProof = `<h4>Invalid Proof!</h4>`
var validProof = `<h4>Valid Proof!</h4>`

func main() {

	ch := make(chan struct{}, 0)
	fmt.Printf("Hello Web Assembly from Go!\n")

	js.Global().Set("runcircuit", js.FuncOf(runcircuit))
	<-ch
}

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

type TestContent struct {
	x frontend.Variable `gnark:","`
}

//CalculateHash hashes the values of a TestContent
func (t TestContent) CalculateHash() ([]byte, error) {
	h := sha256.New()
	if _, err := h.Write([]byte("1")); err != nil {
		return nil, err
	}

	return h.Sum(nil), nil
}

//Equals tests for equality of two Contents
func (t TestContent) Equals(other merkletree.Content) (bool, error) {
	return t.x == other.(TestContent).x, nil
}

func (circuit *Circuit) Define(api frontend.API) error {
	mimc, _ := mimc.NewMiMC(api)

	mimc.Write(api.Add(circuit.PI.AgreementStateRoot, circuit.PI.AgreementStateSalt))
	api.AssertIsEqual(circuit.I.AgreementStateCommitment, mimc.Sum())

	mimc.Reset()
	mimc.Write(api.Add(circuit.PI.Order, circuit.PI.OrderSalt))
	api.AssertIsEqual(circuit.I.StateObjectCommitment, mimc.Sum())

	t := makeMerkle(circuit.PI.BuyerPK, circuit.PI.SellerPK, circuit.PI.ProductIdsRoot)
	api.AssertIsEqual(circuit.PI.BuyerPK, 1)
	api.AssertIsEqual(circuit.PI.SellerPK, 1)
	api.AssertIsEqual(circuit.PI.ProductIdsRoot, 1)

	api.AssertIsEqual(t.MerkleRoot(), circuit.PI.AgreementStateRoot)

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

func makeMerkle(BPK frontend.Variable, SPK frontend.Variable, PIP frontend.Variable) *merkletree.MerkleTree {
	var list []merkletree.Content
	list = append(list, TestContent{x: BPK})
	list = append(list, TestContent{x: SPK})
	list = append(list, TestContent{x: PIP})

	//Create a new Merkle Tree from the list of Content
	t, err := merkletree.NewTree(list)
	if err != nil {
		log.Fatal(err)
	}

	return t
}

func runcircuit(this js.Value, inputs []js.Value) interface{} {

	var zkcircuit Circuit
	r1cs, err := frontend.Compile(ecc.BN254, backend.GROTH16, &zkcircuit)
	if err != nil {
		log.Fatal(err)
	}

	// generating pk, vk
	pk, vk, err := groth16.Setup(r1cs)
	assignment := &Circuit{
		I: Input{
			AgreementStateCommitment: "14148558618612511066119773842969464723224450289245446087478928843598143811659",
			StateObjectCommitment:    "3809531659786630799763432231414721345625774896241005522309640398181762968274",
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
		log.Println("INVALID PROOF!")
		return invalidProof
	} else {
		fmt.Println("VALID PROOF")
		return validProof
	}
}
