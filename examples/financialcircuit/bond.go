package financial

import (
	"github.com/consensys/gnark-crypto/ecc"
	edwardsbn254 "github.com/consensys/gnark-crypto/ecc/bn254/twistededwards"
	"github.com/consensys/gnark/frontend"
	"github.com/consensys/gnark/std/algebra/twistededwards"
	"github.com/consensys/gnark/std/hash/mimc"
	"github.com/consensys/gnark/std/signature/eddsa"
)

// PublicKey stores an eddsa public key (to be used in gnark circuit)
// required to verify signatures in gnark
type PublicKey = eddsa.PublicKey

// Signature
type Signature = eddsa.Signature

func parseSignature(id ecc.ID, buf []byte) ([]byte, []byte, []byte) {

	var pointbn254 edwardsbn254.PointAffine

	switch id {
	case ecc.BN254:
		pointbn254.SetBytes(buf[:32])
		a, b := parsePoint(id, buf)
		s := buf[32:]
		return a[:], b[:], s
	default:
		return buf, buf, buf
	}
}

func parsePoint(id ecc.ID, buf []byte) ([]byte, []byte) {
	var pointbn254 edwardsbn254.PointAffine

	switch id {
	case ecc.BN254:
		pointbn254.SetBytes(buf[:32])
		a := pointbn254.X.Bytes()
		b := pointbn254.Y.Bytes()
		return a[:], b[:]
	default:
		return buf, buf
	}
}

// this structure declares the public inputs and secrets keys
type bondCircuit struct {
	//Accepted Bid 92.63 by the 2 parties prior to creating the circuit
	//Before the circuit is build the initiator knows  the responder whos bid was accepted
	AcceptedQuoteQuery  frontend.Variable    `gnark:",public"` // 92.63
	AcceptedQuoteSigned Signature            `gnark:",public"` // to prevent spam
	PublicKeyCpts       [3]PublicKey         `gnark:",public"` // Public key to check quotes signed - The reason for the public keys is to confirm who participated in providing quotes
	Bond                frontend.Variable    `gnark:",public"` // hash of Isin, Ticker and Size
	SignatureCpts       [3]Signature         `gnark:",secret"` // Sign(quote)
	QuoteFromCpts       [3]frontend.Variable `gnark:",secret"` // Example: 92.63
	AcceptedQuotePubKey PublicKey            `gnark:",secret"` // It is going to be PublicKeyCpt1 or PublicKeyCpt2 or PublicKeyC
	AcceptedQuote       frontend.Variable    `gnark:",secret"` //
	RejectedQuotes      [2]frontend.Variable `gnark:",secret"` //
	BondQuoteSignedCpts [3]Signature         `gnark:",secret"` // Sign(Bond hash, quote)
}

// this function is called on set up/compile
func (circuit *bondCircuit) Define(api frontend.API) error {

	// check if all entries are greater than zero
	api.AssertIsLessOrEqual(0, circuit.QuoteFromCpts[0])
	api.AssertIsLessOrEqual(0, circuit.QuoteFromCpts[1])
	api.AssertIsLessOrEqual(0, circuit.QuoteFromCpts[2])

	// All quotes should not be equal to zero
	checkZeroCpt1 := api.IsZero(circuit.QuoteFromCpts[0])
	checkZeroCpt2 := api.IsZero(circuit.QuoteFromCpts[1])
	checkZeroCpt3 := api.IsZero(circuit.QuoteFromCpts[2])

	checkZeroTemp := api.Or(checkZeroCpt1, checkZeroCpt2)
	checkZeroResult := api.Or(checkZeroTemp, checkZeroCpt3)

	api.AssertIsEqual(checkZeroResult, 0)

	// Make sure Winner Quote is the smallest one or matching the bid
	api.AssertIsLessOrEqual(circuit.AcceptedQuote, circuit.RejectedQuotes[0])
	api.AssertIsLessOrEqual(circuit.AcceptedQuote, circuit.RejectedQuotes[1])
	api.AssertIsEqual(circuit.AcceptedQuote, circuit.AcceptedQuoteQuery)

	// If winner quote is from Cpt1, Cpt2 or Cpt3, one of the subtraction is going to return zero
	// The circuit is build with all quotes received from responders
	subCpt1 := api.Sub(circuit.QuoteFromCpts[0], circuit.AcceptedQuote)
	subCpt2 := api.Sub(circuit.QuoteFromCpts[1], circuit.AcceptedQuote)
	subCpt3 := api.Sub(circuit.QuoteFromCpts[2], circuit.AcceptedQuote)

	// 1 - it is zero, so it is true. If 0, it isn't zero and is false
	outputCpt1 := api.IsZero(subCpt1)
	outputCpt2 := api.IsZero(subCpt2)
	outputCpt3 := api.IsZero(subCpt3)

	// outputCpt1 || outputCpt2 || outputCpt3 == 1
	resultTemp := api.Or(outputCpt1, outputCpt2)
	result := api.Or(resultTemp, outputCpt3)

	api.AssertIsEqual(result, 1)

	params, err := twistededwards.NewEdCurve(api.Curve())
	if err != nil {
		return err
	}

	circuit.AcceptedQuotePubKey.Curve = params
	eddsa.Verify(api, circuit.AcceptedQuoteSigned, circuit.AcceptedQuote, circuit.AcceptedQuotePubKey)

	// verify the signature in the cs for Cpt1, Cpt2, Cpt3
	// verify that the quote quote1 came from the associated cpt1
	circuit.PublicKeyCpts[0].Curve = params
	eddsa.Verify(api, circuit.SignatureCpts[0], circuit.QuoteFromCpts[0], circuit.PublicKeyCpts[0])

	circuit.PublicKeyCpts[1].Curve = params
	eddsa.Verify(api, circuit.SignatureCpts[1], circuit.QuoteFromCpts[1], circuit.PublicKeyCpts[1])

	circuit.PublicKeyCpts[2].Curve = params
	eddsa.Verify(api, circuit.SignatureCpts[2], circuit.QuoteFromCpts[2], circuit.PublicKeyCpts[2])

	//check Isin + quote
	mimc, _ := mimc.NewMiMC("seed", api)
	mimc.Write(circuit.Bond, circuit.QuoteFromCpts[0])
	IsinQuoteFromCpt1Hash := mimc.Sum()
	mimc.Reset()
	mimc.Write(circuit.Bond, circuit.QuoteFromCpts[1])
	IsinQuoteFromCpt2Hash := mimc.Sum()
	mimc.Reset()
	mimc.Write(circuit.Bond, circuit.QuoteFromCpts[2])
	IsinQuoteFromCpt3Hash := mimc.Sum()
	mimc.Reset()

	// the quote is valid only for that bond and the cpt1
	circuit.PublicKeyCpts[0].Curve = params
	eddsa.Verify(api, circuit.BondQuoteSignedCpts[0], IsinQuoteFromCpt1Hash, circuit.PublicKeyCpts[0])

	circuit.PublicKeyCpts[1].Curve = params
	eddsa.Verify(api, circuit.BondQuoteSignedCpts[1], IsinQuoteFromCpt2Hash, circuit.PublicKeyCpts[1])

	circuit.PublicKeyCpts[2].Curve = params
	eddsa.Verify(api, circuit.BondQuoteSignedCpts[2], IsinQuoteFromCpt3Hash, circuit.PublicKeyCpts[2])

	return nil
}
