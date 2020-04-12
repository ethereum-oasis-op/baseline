const fs = require('fs');
const assert = require('assert');

/**
 * Radish specific class for resolving organisation artifacts based on a supplied directory containing config file(s).
 */
class RadishOrganisationConfigpathResolver {

	/**
	 * 
	 * @param {string} configDir path to a valid directory that will be used to look for config files.
	 */
	constructor(configDir) {
		if (typeof configDir === 'undefined') {
			throw new Error('Organisational config directory not supplied');
		}
		this.configDir = configDir;
		this.configCache = {}
	}

	/**
	 * Resolves organisation information object.
	 * 
	 * @param {string} organisationName - name of the organisation will be used to search for ${this.configDir}/config-${organisationName}.json file
	 * @param {string} messagingKey - messaging key for the organisation
	 * 
	 * @returns unified organisation object containing organisation information and their messaging key.
	 */
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