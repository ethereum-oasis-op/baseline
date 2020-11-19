package main

import (
	"encoding/json"
	"errors"
	"fmt"
	"time"

	"github.com/hashgraph/hedera-sdk-go"
)

const baselineMessageTopicMemo = "baseline public HCS topic"

// createBaselineMessageTopic initializes the given public baseline HCS topic
func createBaselineMessageTopic(publicKey string, maxFee float64) error {
	pubKey, err := hedera.PublicKeyFromString(publicKey)
	if err != nil {
		return err
	}

	tx := hedera.NewTopicCreateTransaction().SetAdminKey(pubKey).SetMaxTransactionFee(hedera.NewHbar(maxFee)).SetTopicMemo(baselineMessageTopicMemo)
	resp, err := tx.Execute(defaultHederaClient)
	if err != nil {
		log.Warningf("failed to execute HCS message topic creation tx; %s", err.Error())
		return err
	}

	// log.Debugf("broadcast tx: %s", string(resp.Hash))

	receipt, err := resp.GetReceipt(defaultHederaClient)
	if err != nil {
		log.Warningf("failed to fetch tx receipt; %s", err.Error())
		return err
	}

	baselineMessageTopicID = stringOrNil(fmt.Sprintf("%v", *receipt.TopicID))
	log.Debugf("created HCS message topic: %s", *baselineMessageTopicID)
	return err
}

// register the given organization using the  to the public baseline HCS topic
func register(org *Organization) error {
	if baselineMessageTopicID == nil {
		return errors.New("failed to register organization; nil HCS message topic")
	}

	topicID, err := hedera.TopicIDFromString(*baselineMessageTopicID)
	if err != nil {
		return err
	}

	payload, err := json.Marshal(org)
	tx := hedera.NewTopicMessageSubmitTransaction().SetTopicID(topicID).SetMessage(payload)

	resp, err := tx.Execute(defaultHederaClient)
	if err != nil {
		log.Warningf("failed to execute HCS message topic creation tx; %s", err.Error())
		return err
	}

	receipt, err := resp.GetReceipt(defaultHederaClient)
	if err != nil {
		log.Warningf("failed to fetch tx receipt; %s", err.Error())
		return err
	}

	log.Debugf("submitted %d-byte HCS message tx on topic: %s", len(payload), receipt.TopicID)
	return err
}

// subscribe to the public baseline HCS topic and replay the
// org registry messages from `start`
func subscribe(start *time.Time) error {
	if baselineMessageTopicID == nil {
		return errors.New("failed to register organization; nil HCS message topic")
	}

	startTime := time.Unix(0, 0)
	if start != nil {
		startTime = *start
	}

	topicID, err := hedera.TopicIDFromString(*baselineMessageTopicID)
	if err != nil {
		return err
	}

	_, err = hedera.NewTopicMessageQuery().
		SetTopicID(topicID).
		SetStartTime(startTime).
		Subscribe(defaultHederaClient, func(message hedera.TopicMessage) {
			log.Debugf("received %d-byte message on HCS topic: %s", len(message.Contents), *baselineMessageTopicID)
			// TODO: add configurable message handler...
		})

	if err == nil {
		log.Debugf("subscribed to HCS topic: %s", *baselineMessageTopicID)
	}

	return err
}
