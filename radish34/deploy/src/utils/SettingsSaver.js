const fs = require('fs');
const assert = require('assert');
const axios = require('axios');

const getWhisperIdentity = url => axios.get(url).then(response => response.data[0].publicKey);

class SettingsSaver {

	constructor(configDir, rpcProvider) {
		if (typeof configDir === 'undefined') {
			throw new Error('Organisational config directory not supplied');
		}
		this.configDir = configDir;
		this.rpcProvider = rpcProvider;
	}

	async updateSettings(organisationName, organisationWhisperURL, addresses) {
		const organisationConfigPath = `${this.configDir}/config-${organisationName}.json`;
		const messagingKey = await getWhisperIdentity(`${organisationWhisperURL}/api/v1/identities`);
		const {
			organization
		} = JSON.parse(fs.readFileSync(organisationConfigPath));

		const newOrganization = {
			...organization,
			messengerKey: messagingKey
		}

		let settings = {
			rpcProvider: this.rpcProvider,
			organization: newOrganization,
			addresses
		}

		try {
			fs.writeFileSync(organisationConfigPath, JSON.stringify(settings, null, 2));
			console.log(`Updated settings in file ${organisationConfigPath}`);
		} catch (err) {
			console.log(`Error writing to settings file ${organisationConfigPath}`);
			return process.exit(1);
		}

		return settings;
	}

}

module.exports = SettingsSaver