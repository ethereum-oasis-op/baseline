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
//required to verify signatures in gnark
type PublicKey = eddsa.PublicKey
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
	AcceptedQuoteQuery  frontend.Variable `gnark:",public"`  // 92.63
	AcceptedQuoteSigned Signature         `gnark:",public"`  // to prevent spam
	PublicKeyCpt1       PublicKey         `gnark:",public"`  // Public key to check quotes signed - The reason for the public keys is to confirm who participated in providing quotes
	PublicKeyCpt2       PublicKey         `gnark:",public"`  // Public key to check quotes signed
	PublicKeyCpt3       PublicKey         `gnark:",public"`  // Public key to check quotes signed
	Bond                frontend.Variable `gnark:",public"`  // hash of Isin, Ticker and Size
	SignatureCpt1       Signature         `gnark:",private"` // Sign(quote)
	SignatureCpt2       Signature         `gnark:",private"` // Sign(quote)
	SignatureCpt3       Signature         `gnark:",private"` // Sign(quote)
	QuoteFromCpt1       frontend.Variable `gnark:",private"` // Example: 92.63
	QuoteFromCpt2       frontend.Variable `gnark:",private"` // Example: 92.40
	QuoteFromCpt3       frontend.Variable `gnark:",private"` // Example: 93
	AcceptedQuotePubKey PublicKey         `gnark:",private"` // It is going to be PublicKeyCpt1 or PublicKeyCpt2 or PublicKeyC
	AcceptedQuote       frontend.Variable `gnark:",private"` // ig: 92.63
	RejectedQuote1      frontend.Variable `gnark:",private"` // ig: 93 - Rejected quote order doesn't matter
	RejectedQuote2      frontend.Variable `gnark:",private"` // ig: 92.40
	BondQuoteSignedCpt1 Signature         `gnark:",private"` // Sign(Bond hash, quote)
	BondQuoteSignedCpt2 Signature         `gnark:",private"` // Sign(Bond hash, quote)
	BondQuoteSignedCpt3 Signature         `gnark:",private"` // Sign(Bond hash, quote)
}

func (circuit *bondCircuit) Define(curveID ecc.ID, cs *frontend.ConstraintSystem) error {

	// All quotes should be greater than zero
	checkZeroCpt1 := cs.IsZero(circuit.QuoteFromCpt1, curveID)
	checkZeroCpt2 := cs.IsZero(circuit.QuoteFromCpt2, curveID)
	checkZeroCpt3 := cs.IsZero(circuit.QuoteFromCpt3, curveID)

	checkZero_temp := cs.Or(checkZeroCpt1, checkZeroCpt2)
	checkZero_result := cs.Or(checkZero_temp, checkZeroCpt3)

	cs.AssertIsEqual(checkZero_result, 0)

	// Make sure Winner Quote is the smallest one or matching the bid
	cs.AssertIsLessOrEqual(circuit.AcceptedQuote, circuit.RejectedQuote1)
	cs.AssertIsLessOrEqual(circuit.AcceptedQuote, circuit.RejectedQuote2)
	cs.AssertIsEqual(circuit.AcceptedQuote, circuit.AcceptedQuoteQuery)

	// If winner quote is from Cpt1, Cpt2 or Cpt3, one of the subtraction is going to return zero
	// The circuit is build with all quotes received from responders
	subCpt1 := cs.Sub(circuit.QuoteFromCpt1, circuit.AcceptedQuote)
	subCpt2 := cs.Sub(circuit.QuoteFromCpt2, circuit.AcceptedQuote)
	subCpt3 := cs.Sub(circuit.QuoteFromCpt3, circuit.AcceptedQuote)

	outputCpt1 := cs.IsZero(subCpt1, curveID) // 1 - iszero - true
	outputCpt2 := cs.IsZero(subCpt2, curveID) // 0 false
	outputCpt3 := cs.IsZero(subCpt3, curveID) // 0 false

	// outputCpt1 || outputCpt2 || outputCpt3 == 1
	result_temp := cs.Or(outputCpt1, outputCpt2)
	result := cs.Or(result_temp, outputCpt3)

	one := cs.Constant(1)
	cs.AssertIsEqual(result, one)

	params, err := twistededwards.NewEdCurve(curveID)
	if err != nil {
		return err
	}

	circuit.AcceptedQuotePubKey.Curve = params
	eddsa.Verify(cs, circuit.AcceptedQuoteSigned, circuit.AcceptedQuote, circuit.AcceptedQuotePubKey)

	// verify the signature in the cs for A,B,C
	circuit.PublicKeyCpt1.Curve = params
	eddsa.Verify(cs, circuit.SignatureCpt1, circuit.QuoteFromCpt1, circuit.PublicKeyCpt1)

	circuit.PublicKeyCpt2.Curve = params
	eddsa.Verify(cs, circuit.SignatureCpt2, circuit.QuoteFromCpt2, circuit.PublicKeyCpt2)

	circuit.PublicKeyCpt3.Curve = params
	eddsa.Verify(cs, circuit.SignatureCpt3, circuit.QuoteFromCpt3, circuit.PublicKeyCpt3)

	//check Isin + quote
	mimc, _ := mimc.NewMiMC("seed", curveID)
	IsinQuoteFromCpt1Hash := mimc.Hash(cs, circuit.Bond, circuit.QuoteFromCpt1)
	IsinQuoteFromCpt2Hash := mimc.Hash(cs, circuit.Bond, circuit.QuoteFromCpt2)
	IsinQuoteFromCpt3Hash := mimc.Hash(cs, circuit.Bond, circuit.QuoteFromCpt3)

	circuit.PublicKeyCpt1.Curve = params
	eddsa.Verify(cs, circuit.BondQuoteSignedCpt1, IsinQuoteFromCpt1Hash, circuit.PublicKeyCpt1)

	circuit.PublicKeyCpt2.Curve = params
	eddsa.Verify(cs, circuit.BondQuoteSignedCpt2, IsinQuoteFromCpt2Hash, circuit.PublicKeyCpt2)

	circuit.PublicKeyCpt3.Curve = params
	eddsa.Verify(cs, circuit.BondQuoteSignedCpt3, IsinQuoteFromCpt3Hash, circuit.PublicKeyCpt3)

	return nil
}
