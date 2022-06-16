package json

type VerifyInput struct {
	I OrderCircuitInput `json:"I"`
	P string            `json:"P"`
}

type OrderCircuitInput struct {
	AgreementStateCommitment string `json:"AgreementStateCommitment"`
	StateObjectCommitment    string `json:"StateObjectCommitment"`
	CalculatedAgreementRoot  string `json:"CalculatedAgreementRoot"`
	OrderRoot                string `json:"OrderRoot"`
	OrderSalt                string `json:"OrderSalt"`
	BuyerPK                  string `json:"BuyerPK"`
	AgreementStateRoot       string `json:"AgreementStateRoot"`
	AgreementStateSalt       string `json:"AgreementStateSalt"`
	ProductId                string `json:"ProductId"`
	BuyerSig                 string `json:"BuyerSig"`
}
