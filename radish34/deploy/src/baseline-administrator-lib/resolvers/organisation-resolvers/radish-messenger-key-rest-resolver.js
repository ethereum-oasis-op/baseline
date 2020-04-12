const fs = require('fs');
const assert = require('assert');
const axios = require('axios');

const getWhisperIdentity = url => axios.get(url).then(response => response.data[0].publicKey);

/**
 * Radish specific resolver for secret communication messenger artifacts. Uses REST to ask an endpoint for info.
 */
class RadishMessengerKeyRestResolver {


	/**
	 * Given an organisationMessengerURL it will call its /api/v1/identities endpoint and extract the public key of the url. 
	 * 
	 * Pass the messenger url of the organisation you want to communicate with.
	 * 
	 * @param {string} organisationMessengerURL - url to call and ask for messaging key to use in secret communication
	 */
	async resolveMessengerKey(organisationMessengerURL) {
		assert(organisationMessengerURL, `organisationMessengerURL is needed to resolve the messenger key`);
		const messagingKey = await getWhisperIdentity(`${organisationMessengerURL}/api/v1/identities`);

		return messagingKey;
	}

}

module.exports = RadishMessengerKeyRestResolver