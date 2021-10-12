package financial

import (
	"bytes"
	"encoding/json"

	"github.com/consensys/gnark-crypto/hash"
	"github.com/shopspring/decimal"
)

// Represent a test case
type TestCase struct {
	quoteCpt1       []byte
	quoteCpt2       []byte
	quoteCpt3       []byte
	acceptedQuote   []byte
	bondHash        []byte
	quoteNumberCpt1 string
	quoteNumberCpt2 string
	quoteNumberCpt3 string
	message         string
}

// Bond has an Isin, size and ticker
type Bond struct {
	Isin   string
	Size   string
	Ticker string
}

func createTestCases() [16]TestCase {

	toRet := [16]TestCase{}

	bond := &Bond{
		Isin:   "CA29250NAT24",
		Size:   "550000",
		Ticker: "ENB 5.375 27-Sep-2027",
	}

	// TODO - Cpt1 Quote is always the acepted quote, see how to change that
	// 2nd parameter is always the accepted quote
	toRet[0] = getQuotesValue(bond, "92.63", "92.63", "95", "Initiator Party selected Cpt1")                               // test case 1 - 2 quotes have same value.
	toRet[1] = getQuotesValue(bond, "91.71", "91.71", "91.71", "Initiator Party selected Cpt1")                            // test case 2
	toRet[2] = getQuotesValue(bond, "0", "0", "0", "Generate proof fails - all quotes are zero")                           // test case 10
	toRet[3] = getQuotesValue(bond, "92.63", "92.63", "92.63", "Initiator Party selected Cpt1")                            // test case 2
	toRet[4] = getQuotesValue(bond, "97.63", "94.63", "95.63", "Generate proof fails - Initiator selected a higher quote") // test case 8
	toRet[5] = getQuotesValue(bond, "-97.63", "-94.63", "-95.63", "Generate proof fails - Negative quotes")                // test case 11

	bond = &Bond{
		Isin:   "CA29250NAT25",
		Size:   "1550000",
		Ticker: "ENB 1.375 10-Sep-2025",
	}

	toRet[6] = getQuotesValue(bond, "91.63", "92.63", "95.63", "Initiator Party selects the smallest quote")
	toRet[7] = getQuotesValue(bond, "93", "98", "94", "Initiator Party selects the smallest integer quote")

	//test cases for exotic bonds, callable bond, step up, FRN. need to update quotes
	bond = &Bond{
		Isin:   "6625HKC3",
		Size:   "550000",
		Ticker: "JPM 3.125% 01/23/2025 Callable",
	}
	toRet[8] = getQuotesValue(bond, "91.63", "92.63", "95.63", "Initiator Party selects the smallest quote")
	toRet[9] = getQuotesValue(bond, "93", "98", "94", "Initiator Party selects the smallest integer quote")
	// Callable with a step up on 6/23/26
	bond = &Bond{
		Isin:   "8128GT91",
		Size:   "450000",
		Ticker: "JPM  STEP 06/23/2030 Callable Step 06/23/2026 @ 2.25",
	}
	toRet[10] = getQuotesValue(bond, "91.63", "92.63", "95.63", "Initiator Party selects the smallest quote")
	toRet[11] = getQuotesValue(bond, "93", "98", "94", "Initiator Party selects the smallest integer quote")
	// FRN/Variable rate bond
	bond = &Bond{
		Isin:   "89114QCR7",
		Size:   "600000",
		Ticker: "The Toronto-Dominion VAR 03/04/2024",
	}
	toRet[12] = getQuotesValue(bond, "91.63", "92.63", "95.63", "Initiator Party selects the smallest quote")
	toRet[13] = getQuotesValue(bond, "93", "98", "94", "Initiator Party selects the smallest integer quote")
	bond = &Bond{
		Isin:   "46625HKC3",
		Size:   "625000",
		Ticker: "JPM 3.125% 01/23/2025 Callable",
	}
	toRet[14] = getQuotesValue(bond, "91.63", "92.63", "95.63", "Initiator Party selects the smallest quote")
	toRet[15] = getQuotesValue(bond, "93", "98", "94", "Initiator Party selects the smallest integer quote")

	return toRet
}

func getQuotesValue(bond *Bond, quoteCpt1, quoteCpt2, quoteCpt3, message string) TestCase {

	_quoteCpt1, err := decimal.NewFromString(quoteCpt1)
	_quoteCpt2, err := decimal.NewFromString(quoteCpt2)
	_quoteCpt3, err := decimal.NewFromString(quoteCpt3)
	if err != nil {
		panic(err)
	}

	one100 := decimal.NewFromInt(100)
	bondSize, err := decimal.NewFromString(bond.Size)

	// 93.63 / 100 = 0,9363
	_quoteCpt1 = _quoteCpt1.Div(one100)
	_quoteCpt2 = _quoteCpt2.Div(one100)
	_quoteCpt3 = _quoteCpt3.Div(one100)

	//0.9363 * 550000 = 514965
	_quoteCpt1 = bondSize.Mul(_quoteCpt1)
	_quoteCpt2 = bondSize.Mul(_quoteCpt2)
	_quoteCpt3 = bondSize.Mul(_quoteCpt3)

	//convert to cents * 100
	// 514965 * 100 = 51496500
	_quoteCpt1 = _quoteCpt1.Mul(one100)
	_quoteCpt2 = _quoteCpt2.Mul(one100)
	_quoteCpt3 = _quoteCpt3.Mul(one100)

	var testCase TestCase
	testCase.quoteNumberCpt1 = quoteCpt1
	testCase.quoteNumberCpt2 = quoteCpt2
	testCase.quoteNumberCpt3 = quoteCpt3
	testCase.quoteCpt1 = _quoteCpt1.BigInt().Bytes()
	testCase.quoteCpt2 = _quoteCpt2.BigInt().Bytes()
	testCase.quoteCpt3 = _quoteCpt3.BigInt().Bytes()

	testCase.acceptedQuote = _quoteCpt1.BigInt().Bytes()

	reqBodyBytes := new(bytes.Buffer)
	json.NewEncoder(reqBodyBytes).Encode(bond)

	hashFunc := hash.MIMC_BN254

	goMimc := hashFunc.New("seed")
	goMimc.Write([]byte(reqBodyBytes.Bytes()))
	var IsinHash = goMimc.Sum(nil)
	testCase.bondHash = IsinHash

	testCase.message = message
	return testCase
}
