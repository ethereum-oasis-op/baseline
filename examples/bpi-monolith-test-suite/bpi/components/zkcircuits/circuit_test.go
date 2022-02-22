package main

import (
	"github.com/consensys/gnark-crypto/ecc"
	"github.com/consensys/gnark/frontend"
	"github.com/consensys/gnark/test"
	"syscall/js"
	"testing"
)

func TestZkCircuit(t *testing.T) {
	assert := test.NewAssert(t)

	var zkcircuit Circuit

	assert.ProverSucceeded(&zkcircuit, &Circuit{
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
	}, test.WithCurves(ecc.BN254), test.WithCompileOpts(frontend.IgnoreUnconstrainedInputs()))

}
