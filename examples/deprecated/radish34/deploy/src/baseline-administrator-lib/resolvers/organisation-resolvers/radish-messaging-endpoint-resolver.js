const assert = require('assert');
const fs = require('fs');

/**
 * Radish-specific resolver for the NATS endpoint of an organisation.
 */
class RadishMessagingEndpointResolver {

  /**
   * Constructor.
   *
   * @param {string} configDir path to a valid directory that will be used to look for config files.
   */
  constructor(configDir) {
    if (typeof configDir === 'undefined') {
      throw new Error('Organisational config directory not supplied');
    }
    this.configDir = configDir;
  }

  /**
   * Given an organisation name, resolve the NATS endpoint.
   *
   * @param {string} organisationName - name of the organisation will be used to search for ${this.configDir}/config-${organisationName}.json file
   */
  async resolve(organisationName) {
    assert(organisationName, `organiszationName is needed to resolve the messenging endpoint`);
    const organisationConfigPath = `${this.configDir}/config-${organisationName}.json`;
    assert(
      fs.existsSync(organisationConfigPath),
      `The requested config does not exist at ${organisationConfigPath}`,
    );
    const { organization } = JSON.parse(fs.readFileSync(organisationConfigPath));

    return organization.messagingEndpoint;
  }
}

module.exports = RadishMessagingEndpointResolver;
