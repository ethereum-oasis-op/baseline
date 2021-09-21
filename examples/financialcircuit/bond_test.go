package financial

import (
	"bytes"
	"fmt"
	"math/big"
	"math/rand"
	"os"
	"testing"

	"github.com/consensys/gnark-crypto/ecc"
	"github.com/consensys/gnark-crypto/ecc/bn254/fp"
	eddsabn254 "github.com/consensys/gnark-crypto/ecc/bn254/twistededwards/eddsa"
	"github.com/consensys/gnark-crypto/hash"
	"github.com/consensys/gnark-crypto/signature"

	"github.com/consensys/gnark/backend"
	"github.com/consensys/gnark/backend/groth16"
	"github.com/consensys/gnark/frontend"
)

const (
	r1csPath     = "circuit/bond.r1cs"
	pkPath       = "circuit/bond.pk"
	vkPath       = "circuit/bond.vk"
	solidityPath = "circuit/bond.sol"
)

func TestBondv(t *testing.T) {

	/**
	*  First step: Compile and Setup circuit.
	 */
	var circuit bondCircuit
	var err error
	// compiles our circuit into a R1CS
	fmt.Println("Compiling Bond circuit")
	r1cs, err := frontend.Compile(ecc.BN254, backend.GROTH16, &circuit)

	f, err := os.Create(r1csPath)
	_, err = r1cs.WriteTo(f)

	fmt.Println("Setting up circuit - This step will take around 2 minutes")
	pk, vk, err := groth16.Setup(r1cs)
	fmt.Println("pk and vk created. Now starting testing:")
	if err != nil {
		t.Fatal(err)
	}

	// save into a file the pk and vk
	f, err = os.Create(pkPath)
	_, err = pk.WriteTo(f)

	f, err = os.Create(vkPath)
	_, err = vk.WriteTo(f)

	//creating smart contract that can get a proof and public inputs and verify the circuit
	fmt.Println("export solidity verifier", solidityPath)
	f, err = os.Create(solidityPath)
	err = vk.ExportSolidity(f)

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
		witness.BondQuoteSignedCpts[0].R.X.Assign(sigRxt)
		witness.BondQuoteSignedCpts[0].R.Y.Assign(sigRyt)
		witness.BondQuoteSignedCpts[0].S1.Assign(sigS1t)
		witness.BondQuoteSignedCpts[0].S2.Assign(sigS2t)

		sigRxt, sigRyt, sigS1t, sigS2t = parseSignature(id, BondQuoteSignedCpt2)
		witness.BondQuoteSignedCpts[1].R.X.Assign(sigRxt)
		witness.BondQuoteSignedCpts[1].R.Y.Assign(sigRyt)
		witness.BondQuoteSignedCpts[1].S1.Assign(sigS1t)
		witness.BondQuoteSignedCpts[1].S2.Assign(sigS2t)

		sigRxt, sigRyt, sigS1t, sigS2t = parseSignature(id, BondQuoteSignedCpt3)
		witness.BondQuoteSignedCpts[2].R.X.Assign(sigRxt)
		witness.BondQuoteSignedCpts[2].R.Y.Assign(sigRyt)
		witness.BondQuoteSignedCpts[2].S1.Assign(sigS1t)
		witness.BondQuoteSignedCpts[2].S2.Assign(sigS2t)

		AcceptedQuoteSigned, err := privKeyCpt1.Sign(testCase.acceptedQuote[:], hFunc)

		sigRx, sigRy, sigS1, sigS2 := parseSignature(id, AcceptedQuoteSigned)
		witness.AcceptedQuoteSigned.R.X.Assign(sigRx)
		witness.AcceptedQuoteSigned.R.Y.Assign(sigRy)
		witness.AcceptedQuoteSigned.S1.Assign(sigS1)
		witness.AcceptedQuoteSigned.S2.Assign(sigS2)

		witness.AcceptedQuote.Assign(testCase.acceptedQuote)
		witness.RejectedQuotes[0].Assign(testCase.quoteCpt2)
		witness.RejectedQuotes[1].Assign(testCase.quoteCpt3)

		witness.QuoteFromCpts[0].Assign(QuoteFromCpt1)
		witness.QuoteFromCpts[1].Assign(QuoteFromCpt2)
		witness.QuoteFromCpts[2].Assign(QuoteFromCpt3)

		//A
		pubkeyAx, pubkeyAy := parsePoint(id, pubKeyCpt1.Bytes())
		var pbAx, pbAy big.Int
		pbAx.SetBytes(pubkeyAx)
		pbAy.SetBytes(pubkeyAy)
		witness.PublicKeyCpts[0].A.X.Assign(pubkeyAx)
		witness.PublicKeyCpts[0].A.Y.Assign(pubkeyAy)

		witness.AcceptedQuotePubKey.A.X.Assign(pubkeyAx)
		witness.AcceptedQuotePubKey.A.Y.Assign(pubkeyAy)

		sigRx, sigRy, sigS1, sigS2 = parseSignature(id, signatureCpt1)
		witness.SignatureCpts[0].R.X.Assign(sigRx)
		witness.SignatureCpts[0].R.Y.Assign(sigRy)
		witness.SignatureCpts[0].S1.Assign(sigS1)
		witness.SignatureCpts[0].S2.Assign(sigS2)

		//B
		pubkeyBAx, pubkeyBAy := parsePoint(id, pubKeyBCpt2.Bytes())
		var pbBAx, pbBAy big.Int
		pbBAx.SetBytes(pubkeyBAx)
		pbBAy.SetBytes(pubkeyBAy)
		witness.PublicKeyCpts[1].A.X.Assign(pubkeyBAx)
		witness.PublicKeyCpts[1].A.Y.Assign(pubkeyBAy)

		sigBRx, sigBRy, sigBS1, sigBS2 := parseSignature(id, signatureCpt2)
		witness.SignatureCpts[1].R.X.Assign(sigBRx)
		witness.SignatureCpts[1].R.Y.Assign(sigBRy)
		witness.SignatureCpts[1].S1.Assign(sigBS1)
		witness.SignatureCpts[1].S2.Assign(sigBS2)

		//C
		pubkeyCAx, pubkeyCAy := parsePoint(id, pubKeyCpt3.Bytes())
		var pbCAx, pbCAy big.Int
		pbCAx.SetBytes(pubkeyCAx)
		pbCAy.SetBytes(pubkeyCAy)
		witness.PublicKeyCpts[2].A.X.Assign(pubkeyCAx)
		witness.PublicKeyCpts[2].A.Y.Assign(pubkeyCAy)

		sigCRx, sigCRy, sigCS1, sigCS2 := parseSignature(id, signatureCpt3)
		witness.SignatureCpts[2].R.X.Assign(sigCRx)
		witness.SignatureCpts[2].R.Y.Assign(sigCRy)
		witness.SignatureCpts[2].S1.Assign(sigCS1)
		witness.SignatureCpts[2].S2.Assign(sigCS2)

		// Generate Proof
		proof, err := groth16.Prove(r1cs, pk, &witness)

		if err != nil {
			fmt.Println("Test", i, "fails")

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

			witnessCorrectValue.PublicKeyCpts[0].A.X.Assign(pubkeyAx)
			witnessCorrectValue.PublicKeyCpts[0].A.Y.Assign(pubkeyAy)

			witnessCorrectValue.PublicKeyCpts[1].A.X.Assign(pubkeyBAx)
			witnessCorrectValue.PublicKeyCpts[1].A.Y.Assign(pubkeyBAy)

			witnessCorrectValue.PublicKeyCpts[2].A.X.Assign(pubkeyCAx)
			witnessCorrectValue.PublicKeyCpts[2].A.Y.Assign(pubkeyCAy)

			err = groth16.Verify(proof, vk, &witnessCorrectValue)
			if err != nil {
				fmt.Print(err)
			}

			/*Part that is used in a smart contract */
			var (
				a     [2]*big.Int
				b     [2][2]*big.Int
				c     [2]*big.Int
				input [12]*big.Int
			)

			// get proof bytes
			var buf bytes.Buffer
			proof.WriteRawTo(&buf)
			proofBytes := buf.Bytes()

			// proof.Ar, proof.Bs, proof.Krs
			const fpSize = fp.Bytes
			a[0] = new(big.Int).SetBytes(proofBytes[fpSize*0 : fpSize*1])
			a[1] = new(big.Int).SetBytes(proofBytes[fpSize*1 : fpSize*2])
			b[0][0] = new(big.Int).SetBytes(proofBytes[fpSize*2 : fpSize*3])
			b[0][1] = new(big.Int).SetBytes(proofBytes[fpSize*3 : fpSize*4])
			b[1][0] = new(big.Int).SetBytes(proofBytes[fpSize*4 : fpSize*5])
			b[1][1] = new(big.Int).SetBytes(proofBytes[fpSize*5 : fpSize*6])
			c[0] = new(big.Int).SetBytes(proofBytes[fpSize*6 : fpSize*7])
			c[1] = new(big.Int).SetBytes(proofBytes[fpSize*7 : fpSize*8])

			// public witness
			/* Array index:
			0 - AcceptedQuoteQuery  frontend.Variable `gnark:",public"`  // 92.63
			1,2,3,4 - AcceptedQuoteSigned Signature         `gnark:",public"`  // to prevent spam
			5,6 - PublicKeyCpt1       PublicKey         `gnark:",public"`  // Public key to check quotes signed - The reason for the public keys is to confirm who participated in providing quotes
			7,8 - PublicKeyCpt2       PublicKey         `gnark:",public"`  // Public key to check quotes signed
			9,10  - PublicKeyCpt3       PublicKey         `gnark:",public"`  // Public key to check quotes signed
			11 - Bond                frontend.Variable `gnark:",public"`  // hash of Isin, Ticker and Size
			*/
			input[0] = new(big.Int).SetBytes(testCase.acceptedQuote)
			input[1] = new(big.Int).SetBytes(sigRx)
			input[2] = new(big.Int).SetBytes(sigRy)
			input[3] = new(big.Int).SetBytes(sigS1)
			input[4] = new(big.Int).SetBytes(sigS2)

			input[5] = new(big.Int).SetBytes(pubkeyAx)
			input[6] = new(big.Int).SetBytes(pubkeyAy)

			input[7] = new(big.Int).SetBytes(pubkeyBAx)
			input[8] = new(big.Int).SetBytes(pubkeyBAy)

			input[9] = new(big.Int).SetBytes(pubkeyCAx)
			input[10] = new(big.Int).SetBytes(pubkeyCAy)

			input[11] = new(big.Int).SetBytes(IsinHash)

			/*Printing here so we can test values on a deployed smart contract */
			for j := 0; j < 12; j++ {
				fmt.Println(input[j])
			}

			/* Printing inputs for the smart contract */
			fmt.Println("A --")
			fmt.Println(a[0])
			fmt.Println(a[1])

			fmt.Println("B --")
			fmt.Println(b[0][0])
			fmt.Println(b[0][1])
			fmt.Println(b[1][0])
			fmt.Println(b[1][1])

			fmt.Println("C --")
			fmt.Println(c[0])
			fmt.Println(c[1])

			fmt.Println("--")
		}
	}
}
