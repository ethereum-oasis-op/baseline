package financial

import (
	"fmt"
	"math/big"
	"math/rand"
	"testing"

	"github.com/consensys/gnark-crypto/ecc"
	eddsabn254 "github.com/consensys/gnark-crypto/ecc/bn254/twistededwards/eddsa"
	"github.com/consensys/gnark-crypto/hash"
	"github.com/consensys/gnark-crypto/signature"

	"github.com/consensys/gnark/backend"
	"github.com/consensys/gnark/backend/groth16"
	"github.com/consensys/gnark/frontend"
)

func TestBondv(t *testing.T) {

	/**
	*  First step: Compile and Setup circuit.
	 */
	var circuit bondCircuit
	// compiles our circuit into a R1CS
	fmt.Println("Compiling Bond circuit")
	r1cs, err := frontend.Compile(ecc.BN254, backend.GROTH16, &circuit)

	fmt.Println("Setting up circuit - it will take some time")
	pk, vk, err := groth16.Setup(r1cs)
	fmt.Println("pk and vk created. Now starting testing:")
	if err != nil {
		t.Fatal(err)
	}

	/*
	* Populate test cases
	 */
	var testCases = createTestCases()

	size := len(testCases)
	for i := 0; i < size; i++ {

		testCase := testCases[i]
		fmt.Println("Test", i, "- Cpt1 Quote:", testCase.quoteNumberCpt1, "- Cpt2 Quote:",
			testCase.quoteNumberCpt2, "- Cpt3 Quote:",
			testCase.quoteNumberCpt3, "-", testCase.message)
		fmt.Println()

		/*
		* Hash and Signatures
		 */
		hashFunc := hash.MIMC_BN254
		goMimc := hashFunc.New("seed")
		signature.Register(signature.EDDSA_BN254, eddsabn254.GenerateKeyInterfaces)

		// Create a private/pub key to sign
		hFunc := goMimc //hash.MIMC_BN254.New("seed")
		src1 := rand.NewSource(1)
		src2 := rand.NewSource(2)
		src3 := rand.NewSource(3)
		rCpt1 := rand.New(src1)
		rCpt2 := rand.New(src2)
		rCpt3 := rand.New(src3)

		privKeyCpt1, err := signature.EDDSA_BN254.New(rCpt1)
		pubKeyCpt1 := privKeyCpt1.Public()

		privKeyCpt2, err := signature.EDDSA_BN254.New(rCpt2)
		pubKeyBCpt2 := privKeyCpt2.Public()

		privKeyCpt3, err := signature.EDDSA_BN254.New(rCpt3)
		pubKeyCpt3 := privKeyCpt3.Public()

		/* Private and Public Key for A,B and C created */

		//Set values for quotes from A,B and C
		QuoteFromCpt1 := testCase.quoteCpt1
		QuoteFromCpt2 := testCase.quoteCpt2
		QuoteFromCpt3 := testCase.quoteCpt3

		signatureCpt1, err := privKeyCpt1.Sign(QuoteFromCpt1[:], hFunc)
		signatureCpt2, err := privKeyCpt2.Sign(QuoteFromCpt2[:], hFunc)
		signatureCpt3, err := privKeyCpt3.Sign(QuoteFromCpt3[:], hFunc)

		id := ecc.BN254

		// Seting up
		var witness bondCircuit

		var IsinHash = testCase.bondHash
		witness.AcceptedQuoteQuery.Assign(testCase.acceptedQuote)
		witness.Bond.Assign(testCase.bondHash)

		goMimc.Reset()
		goMimc.Write([]byte(IsinHash))
		goMimc.Write([]byte(testCase.quoteCpt1))
		var IsinQuoteCpt1Hashed = goMimc.Sum(nil)
		BondQuoteSignedCpt1, err := privKeyCpt1.Sign(IsinQuoteCpt1Hashed[:], hFunc)

		goMimc.Reset()
		goMimc.Write([]byte(IsinHash))
		goMimc.Write([]byte(testCase.quoteCpt2))
		var IsinQuoteCpt2Hashed = goMimc.Sum(nil)
		BondQuoteSignedCpt2, err := privKeyCpt2.Sign(IsinQuoteCpt2Hashed[:], hFunc)

		goMimc.Reset()
		goMimc.Write([]byte(IsinHash))
		goMimc.Write([]byte(testCase.quoteCpt3))
		var IsinQuoteCpt3Hashed = goMimc.Sum(nil)
		BondQuoteSignedCpt3, err := privKeyCpt3.Sign(IsinQuoteCpt3Hashed[:], hFunc)

		sigRxt, sigRyt, sigS1t, sigS2t := parseSignature(id, BondQuoteSignedCpt1)
		witness.BondQuoteSignedCpt1.R.X.Assign(sigRxt)
		witness.BondQuoteSignedCpt1.R.Y.Assign(sigRyt)
		witness.BondQuoteSignedCpt1.S1.Assign(sigS1t)
		witness.BondQuoteSignedCpt1.S2.Assign(sigS2t)

		sigRxt, sigRyt, sigS1t, sigS2t = parseSignature(id, BondQuoteSignedCpt2)
		witness.BondQuoteSignedCpt2.R.X.Assign(sigRxt)
		witness.BondQuoteSignedCpt2.R.Y.Assign(sigRyt)
		witness.BondQuoteSignedCpt2.S1.Assign(sigS1t)
		witness.BondQuoteSignedCpt2.S2.Assign(sigS2t)

		sigRxt, sigRyt, sigS1t, sigS2t = parseSignature(id, BondQuoteSignedCpt3)
		witness.BondQuoteSignedCpt3.R.X.Assign(sigRxt)
		witness.BondQuoteSignedCpt3.R.Y.Assign(sigRyt)
		witness.BondQuoteSignedCpt3.S1.Assign(sigS1t)
		witness.BondQuoteSignedCpt3.S2.Assign(sigS2t)

		AcceptedQuoteSigned, err := privKeyCpt1.Sign(testCase.acceptedQuote[:], hFunc)

		sigRx, sigRy, sigS1, sigS2 := parseSignature(id, AcceptedQuoteSigned)
		witness.AcceptedQuoteSigned.R.X.Assign(sigRx)
		witness.AcceptedQuoteSigned.R.Y.Assign(sigRy)
		witness.AcceptedQuoteSigned.S1.Assign(sigS1)
		witness.AcceptedQuoteSigned.S2.Assign(sigS2)

		witness.AcceptedQuote.Assign(testCase.acceptedQuote)
		witness.RejectedQuote1.Assign(testCase.quoteCpt2)
		witness.RejectedQuote2.Assign(testCase.quoteCpt3)

		witness.QuoteFromCpt1.Assign(QuoteFromCpt1)
		witness.QuoteFromCpt2.Assign(QuoteFromCpt2)
		witness.QuoteFromCpt3.Assign(QuoteFromCpt3)

		//A
		pubkeyAx, pubkeyAy := parsePoint(id, pubKeyCpt1.Bytes())
		var pbAx, pbAy big.Int
		pbAx.SetBytes(pubkeyAx)
		pbAy.SetBytes(pubkeyAy)
		witness.PublicKeyCpt1.A.X.Assign(pubkeyAx)
		witness.PublicKeyCpt1.A.Y.Assign(pubkeyAy)

		witness.AcceptedQuotePubKey.A.X.Assign(pubkeyAx)
		witness.AcceptedQuotePubKey.A.Y.Assign(pubkeyAy)

		sigRx, sigRy, sigS1, sigS2 = parseSignature(id, signatureCpt1)
		witness.SignatureCpt1.R.X.Assign(sigRx)
		witness.SignatureCpt1.R.Y.Assign(sigRy)
		witness.SignatureCpt1.S1.Assign(sigS1)
		witness.SignatureCpt1.S2.Assign(sigS2)

		//B
		pubkeyBAx, pubkeyBAy := parsePoint(id, pubKeyBCpt2.Bytes())
		var pbBAx, pbBAy big.Int
		pbBAx.SetBytes(pubkeyBAx)
		pbBAy.SetBytes(pubkeyBAy)
		witness.PublicKeyCpt2.A.X.Assign(pubkeyBAx)
		witness.PublicKeyCpt2.A.Y.Assign(pubkeyBAy)

		sigBRx, sigBRy, sigBS1, sigBS2 := parseSignature(id, signatureCpt2)
		witness.SignatureCpt2.R.X.Assign(sigBRx)
		witness.SignatureCpt2.R.Y.Assign(sigBRy)
		witness.SignatureCpt2.S1.Assign(sigBS1)
		witness.SignatureCpt2.S2.Assign(sigBS2)

		//C
		pubkeyCAx, pubkeyCAy := parsePoint(id, pubKeyCpt3.Bytes())
		var pbCAx, pbCAy big.Int
		pbCAx.SetBytes(pubkeyCAx)
		pbCAy.SetBytes(pubkeyCAy)
		witness.PublicKeyCpt3.A.X.Assign(pubkeyCAx)
		witness.PublicKeyCpt3.A.Y.Assign(pubkeyCAy)

		sigCRx, sigCRy, sigCS1, sigCS2 := parseSignature(id, signatureCpt3)
		witness.SignatureCpt3.R.X.Assign(sigCRx)
		witness.SignatureCpt3.R.Y.Assign(sigCRy)
		witness.SignatureCpt3.S1.Assign(sigCS1)
		witness.SignatureCpt3.S2.Assign(sigCS2)

		// Generate Proof
		proof, err := groth16.Prove(r1cs, pk, &witness)

		if err != nil {

			//fmt.Println("Test", i, "fails")

		} else {

			//Check with a correct value and it returns NIL
			var witnessCorrectValue bondCircuit

			witnessCorrectValue.AcceptedQuoteQuery.Assign(testCase.acceptedQuote)

			IsinHash = testCase.bondHash
			witnessCorrectValue.Bond.Assign(IsinHash)

			AcceptedQuoteSigned, err = privKeyCpt1.Sign(testCase.acceptedQuote[:], hFunc)
			sigRx, sigRy, sigS1, sigS2 = parseSignature(id, AcceptedQuoteSigned)
			witnessCorrectValue.AcceptedQuoteSigned.R.X.Assign(sigRx)
			witnessCorrectValue.AcceptedQuoteSigned.R.Y.Assign(sigRy)
			witnessCorrectValue.AcceptedQuoteSigned.S1.Assign(sigS1)
			witnessCorrectValue.AcceptedQuoteSigned.S2.Assign(sigS2)

			witnessCorrectValue.PublicKeyCpt1.A.X.Assign(pubkeyAx)
			witnessCorrectValue.PublicKeyCpt1.A.Y.Assign(pubkeyAy)

			witnessCorrectValue.PublicKeyCpt2.A.X.Assign(pubkeyBAx)
			witnessCorrectValue.PublicKeyCpt2.A.Y.Assign(pubkeyBAy)

			witnessCorrectValue.PublicKeyCpt3.A.X.Assign(pubkeyCAx)
			witnessCorrectValue.PublicKeyCpt3.A.Y.Assign(pubkeyCAy)

			err = groth16.Verify(proof, vk, &witnessCorrectValue)
			if err != nil {
				fmt.Print(err)
			}
		}
	}
}
