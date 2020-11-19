package main

import (
	"os"

	"github.com/hashgraph/hedera-sdk-go"
	logger "github.com/kthomas/go-logger"
)

var (
	baselineMessageAdminKey *string
	baselineMessageTopicID  *string

	defaultHederaClient *hedera.Client

	log *logger.Logger
)

func getLogLevel() string {
	lvl := os.Getenv("LOG_LEVEL")
	if lvl == "" {
		lvl = "debug"
	}
	return lvl
}

func getSyslogEndpoint() *string {
	var endpoint *string
	if os.Getenv("SYSLOG_ENDPOINT") != "" {
		endpoint = stringOrNil(os.Getenv("SYSLOG_ENDPOINT"))
	}
	return endpoint
}

func init() {
	log = logger.NewLogger("hcs-registry", getLogLevel(), getSyslogEndpoint())
	initDefaultHederaClient()
	initBaselineHCS()
}

func initDefaultHederaClient() {
	if os.Getenv("HEDERA_NETWORK") == "testnet" {
		defaultHederaClient = hedera.ClientForTestnet()
	} else {
		defaultHederaClient = hedera.ClientForMainnet()
	}

	operatorID := os.Getenv("HEDERA_OPERATOR_ID")
	operatorKey := os.Getenv("HEDERA_OPERATOR_KEY")

	if operatorID != "" && operatorKey != "" {
		operatorAccountID, err := hedera.AccountIDFromString(operatorID)
		if err != nil {
			log.Panicf("failed to parse HEDERA_OPERATOR_ID; %s", err.Error())
		}

		operatorKey, err := hedera.PrivateKeyFromString(operatorKey)
		if err != nil {
			log.Panicf("failed to parse HEDERA_OPERATOR_KEY; %s", err.Error())
		}

		defaultHederaClient.SetOperator(operatorAccountID, operatorKey)
	} else {
		panic("HEDERA_OPERATOR_ID and HEDERA_OPERATOR_KEY are required")
	}
}

func initBaselineHCS() {
	baselineMessageAdminKey = stringOrNil(os.Getenv("HEDERA_BASELINE_HCS_ADMIN_KEY"))
	baselineMessageTopicID = stringOrNil(os.Getenv("HEDERA_BASELINE_HCS_TOPIC_ID"))

	if baselineMessageAdminKey == nil && baselineMessageTopicID == nil {
		panic("HEDERA_BASELINE_HCS_ADMIN_KEY or HEDERA_BASELINE_HCS_TOPIC_ID must be set")
	}
}

// stringOrNil returns the given string or nil when empty
func stringOrNil(str string) *string {
	if str == "" {
		return nil
	}
	return &str
}
