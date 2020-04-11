const fs = require('fs');
const assert = require('assert');
const axios = require('axios');

const getWhisperIdentity = url => axios.get(url).then(response => response.data[0].publicKey);

class RadishMessengerKeyRestResolver {

	async resolveMessengerKey(organisationMessengerURL) {
		assert(organisationMessengerURL, `organisationMessengerURL is needed to resolve the messenger key`);
		const messagingKey = await getWhisperIdentity(`${organisationMessengerURL}/api/v1/identities`);

		return messagingKey;
	}

}

module.exports = RadishMessengerKeyRestResolver