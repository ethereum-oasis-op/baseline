const fs = require('fs');
const assert = require('assert');
const { getWhisperIdentity } = require('../../utils/identities')

class RadishOrganisationConfigpathResolver {

	constructor(configDir) {
		if(typeof configDir === 'undefined') {
			throw new Error('Organisational config directory not supplied');
		}
		this.configDir = configDir;
		this.configCache = {}
	}

	async resolve(organisationName, organisationWhisperURL) {
		const organisationConfigPath = `${this.configDir}/config-${organisationName}.json`;
		assert(fs.existsSync(organisationConfigPath), `The desired wallet does not exist at ${organisationConfigPath}`);
		const { organization } = JSON.parse(fs.readFileSync(organisationConfigPath));

		const messagingKey = await getWhisperIdentity(`${organisationWhisperURL}/api/v1/identities`);

		return { ...organization, messagingKey };
	}

}

module.exports = RadishOrganisationConfigpathResolver