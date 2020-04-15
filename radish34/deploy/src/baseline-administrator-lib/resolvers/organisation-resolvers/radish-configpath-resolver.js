const fs = require('fs');
const assert = require('assert');
const { execSync } = require('child_process');

const pycryptoCliPath = 'pycrypto/cli.py';

const generateKeyPair = () => {
  let keys = {};
  if (fs.existsSync(pycryptoCliPath)) {
    const stdout = execSync(`python3 ${pycryptoCliPath} keygen`);
    const lines = stdout.toString().split(/\n/);
    const keypair = lines[0].split(/ /);
    if (keypair.length === 2) {
      keys['privateKey'] = `0x${keypair[0]}`;
      keys['publicKey'] = `0x${keypair[1]}`;
    }
  }

  return keys;
}

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

		if (!organization.zkpPublicKey) {
			const { privateKey, publicKey } = generateKeyPair();
			organization.zkpPublicKey = publicKey;
			organization.zkpPrivateKey = privateKey;
		  }

		return {
			...organization,
			messagingKey
		};
	}

}

module.exports = RadishOrganisationConfigpathResolver