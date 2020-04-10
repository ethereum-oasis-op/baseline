const fs = require('fs');


class SettingsReader {

	constructor(configDir) {
		if (typeof configDir === 'undefined') {
			throw new Error('Organisational config directory not supplied');
		}
		this.configDir = configDir;
	}

	async resolveSettings(organisationName) {
		const organisationConfigPath = `${this.configDir}/config-${organisationName}.json`;
		return JSON.parse(fs.readFileSync(organisationConfigPath));
	}

}

module.exports = SettingsReader