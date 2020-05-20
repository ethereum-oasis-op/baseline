const fs = require('fs');
const assert = require('assert');
const axios = require('axios');
const { logger } = require('radish34-logger');

/**
 * Radish specific class for saving settings to configuration file
 */
class SettingsSaver {

	constructor(configDir, rpcProvider) {
		if (typeof configDir === 'undefined') {
			logger.error('Organisational config directory not supplied.', { service: 'DEPLOY' });
			throw new Error('Organisational config directory not supplied.');
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
			logger.info(`Updated settings in file ${organisationConfigPath}.`, { service: 'DEPLOY'});
		} catch (err) {
			logger.error(`Error writing to settings file ${organisationConfigPath}.\n%o`, err, { service: 'DEPLOY' });
			return process.exit(1);
		}

		return settings;
	}

}

module.exports = SettingsSaver
