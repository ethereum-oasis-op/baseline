const fs = require('fs');
const assert = require('assert');
const axios = require('axios');

/**
 * Radish specific class for saving settings to configuration file
 */
class SettingsSaver {

	constructor(configDir, rpcProvider) {
		if (typeof configDir === 'undefined') {
			throw new Error('Organisational config directory not supplied');
		}
		this.configDir = configDir;
		this.rpcProvider = rpcProvider;
	}

	async updateSettings(organisationName, organisationAddress, messagingKey, zkpPublicKey, zkpPrivateKey, addresses) {
		const organisationConfigPath = `${this.configDir}/config-${organisationName}.json`;
		const {
			organization
		} = JSON.parse(fs.readFileSync(organisationConfigPath));

		const newOrganization = {
			...organization,
			zkpPublicKey,
			zkpPrivateKey,
			address: organisationAddress,
			messengerKey: messagingKey,
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