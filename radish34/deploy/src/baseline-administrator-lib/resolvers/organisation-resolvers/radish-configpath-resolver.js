const fs = require('fs');
const assert = require('assert');

class RadishOrganisationConfigpathResolver {

	constructor(configDir) {
		if (typeof configDir === 'undefined') {
			throw new Error('Organisational config directory not supplied');
		}
		this.configDir = configDir;
		this.configCache = {}
	}

	async resolve(organisationName, messagingKey) {
		const organisationConfigPath = `${this.configDir}/config-${organisationName}.json`;
		assert(fs.existsSync(organisationConfigPath), `The desired wallet does not exist at ${organisationConfigPath}`);
		const {
			organization
		} = JSON.parse(fs.readFileSync(organisationConfigPath));

		return {
			...organization,
			messagingKey
		};
	}

}

module.exports = RadishOrganisationConfigpathResolver