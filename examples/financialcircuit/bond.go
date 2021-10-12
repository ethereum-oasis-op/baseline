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

func parseSignature(id ecc.ID, buf []byte) ([]byte, []byte, []byte, []byte) {

	var pointbn254 edwardsbn254.PointAffine

	switch id {
	case ecc.BN254:
		pointbn254.SetBytes(buf[:32])
		a, b := parsePoint(id, buf)
		s1 := buf[32:48] // r is 256 bits, so s = 2^128*s1 + s2
		s2 := buf[48:]
		return a[:], b[:], s1, s2
	default:
		return buf, buf, buf, buf
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
	AcceptedQuoteQuery  frontend.Variable    `gnark:",public"`  // 92.63
	AcceptedQuoteSigned Signature            `gnark:",public"`  // to prevent spam
	PublicKeyCpts       [3]PublicKey         `gnark:",public"`  // Public key to check quotes signed - The reason for the public keys is to confirm who participated in providing quotes
	Bond                frontend.Variable    `gnark:",public"`  // hash of Isin, Ticker and Size
	SignatureCpts       [3]Signature         `gnark:",private"` // Sign(quote)
	QuoteFromCpts       [3]frontend.Variable `gnark:",private"` // Example: 92.63
	AcceptedQuotePubKey PublicKey            `gnark:",private"` // It is going to be PublicKeyCpt1 or PublicKeyCpt2 or PublicKeyC
	AcceptedQuote       frontend.Variable    `gnark:",private"` //
	RejectedQuotes      [2]frontend.Variable `gnark:",private"` //
	BondQuoteSignedCpts [3]Signature         `gnark:",private"` // Sign(Bond hash, quote)
}

// this function is called on set up/compile
func (circuit *bondCircuit) Define(curveID ecc.ID, cs *frontend.ConstraintSystem) error {

	// All quotes should be greater than zero
	checkZeroCpt1 := cs.IsZero(circuit.QuoteFromCpts[0], curveID)
	checkZeroCpt2 := cs.IsZero(circuit.QuoteFromCpts[1], curveID)
	checkZeroCpt3 := cs.IsZero(circuit.QuoteFromCpts[2], curveID)

	checkZeroTemp := cs.Or(checkZeroCpt1, checkZeroCpt2)
	checkZeroResult := cs.Or(checkZeroTemp, checkZeroCpt3)

	cs.AssertIsEqual(checkZeroResult, 0)

	// Make sure Winner Quote is the smallest one or matching the bid
	cs.AssertIsLessOrEqual(circuit.AcceptedQuote, circuit.RejectedQuotes[0])
	cs.AssertIsLessOrEqual(circuit.AcceptedQuote, circuit.RejectedQuotes[1])
	cs.AssertIsEqual(circuit.AcceptedQuote, circuit.AcceptedQuoteQuery)

	// If winner quote is from Cpt1, Cpt2 or Cpt3, one of the subtraction is going to return zero
	// The circuit is build with all quotes received from responders
	subCpt1 := cs.Sub(circuit.QuoteFromCpts[0], circuit.AcceptedQuote)
	subCpt2 := cs.Sub(circuit.QuoteFromCpts[1], circuit.AcceptedQuote)
	subCpt3 := cs.Sub(circuit.QuoteFromCpts[2], circuit.AcceptedQuote)

	// 1 - it is zero, so it is true. If 0, it isn't zero and is false
	outputCpt1 := cs.IsZero(subCpt1, curveID)
	outputCpt2 := cs.IsZero(subCpt2, curveID)
	outputCpt3 := cs.IsZero(subCpt3, curveID)

	// outputCpt1 || outputCpt2 || outputCpt3 == 1
	resultTemp := cs.Or(outputCpt1, outputCpt2)
	result := cs.Or(resultTemp, outputCpt3)

	one := cs.Constant(1)
	cs.AssertIsEqual(result, one)

	params, err := twistededwards.NewEdCurve(curveID)
	if err != nil {
		return err
	}

	circuit.AcceptedQuotePubKey.Curve = params
	eddsa.Verify(cs, circuit.AcceptedQuoteSigned, circuit.AcceptedQuote, circuit.AcceptedQuotePubKey)

	// verify the signature in the cs for Cpt1, Cpt2, Cpt3
	// verify that the quote quote1 came from the associated cpt1
	circuit.PublicKeyCpts[0].Curve = params
	eddsa.Verify(cs, circuit.SignatureCpts[0], circuit.QuoteFromCpts[0], circuit.PublicKeyCpts[0])

	circuit.PublicKeyCpts[1].Curve = params
	eddsa.Verify(cs, circuit.SignatureCpts[1], circuit.QuoteFromCpts[1], circuit.PublicKeyCpts[1])

	circuit.PublicKeyCpts[2].Curve = params
	eddsa.Verify(cs, circuit.SignatureCpts[2], circuit.QuoteFromCpts[2], circuit.PublicKeyCpts[2])

	//check Isin + quote
	mimc, _ := mimc.NewMiMC("seed", curveID)
	IsinQuoteFromCpt1Hash := mimc.Hash(cs, circuit.Bond, circuit.QuoteFromCpts[0])
	IsinQuoteFromCpt2Hash := mimc.Hash(cs, circuit.Bond, circuit.QuoteFromCpts[1])
	IsinQuoteFromCpt3Hash := mimc.Hash(cs, circuit.Bond, circuit.QuoteFromCpts[2])

	// the quote is valid only for that bond and the cpt1
	circuit.PublicKeyCpts[0].Curve = params
	eddsa.Verify(cs, circuit.BondQuoteSignedCpts[0], IsinQuoteFromCpt1Hash, circuit.PublicKeyCpts[0])

	circuit.PublicKeyCpts[1].Curve = params
	eddsa.Verify(cs, circuit.BondQuoteSignedCpts[1], IsinQuoteFromCpt2Hash, circuit.PublicKeyCpts[1])

	circuit.PublicKeyCpts[2].Curve = params
	eddsa.Verify(cs, circuit.BondQuoteSignedCpts[2], IsinQuoteFromCpt3Hash, circuit.PublicKeyCpts[2])

	return nil
}
