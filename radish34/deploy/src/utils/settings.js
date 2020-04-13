const fs = require('fs');
const Paths = require('../paths.json');

const getFilePath = role => `${Paths.Config}/config-${role}.json`;

const getServerSettings = role => {
  const filepath = getFilePath(role);
  if (fs.existsSync(filepath)) {
    return JSON.parse(fs.readFileSync(filepath));
  }
  console.log('Setting file not found:', filepath);
  return process.exit(1);
};

const saveSettingsToConfigFile = (role, settings, nextSettings) => {
  const filepath = getFilePath(role);
  if (fs.existsSync(filepath)) {
    try {
      fs.writeFileSync(filepath, JSON.stringify(nextSettings, null, 2));
      console.log(`Updated settings for ${role} to include:`, settings);
    } catch (err) {
      console.log(`Error writing to settings file ${filepath}`);
      return process.exit(1);
    }
  } else {
    console.log(`Could not find settings file: ${filepath}`);
    return process.exit(1);
  }
};

const setServerSettings = (role, settings) => {
  const prevSettings = getServerSettings(role);
  const nextSettings = { rpcProvider: process.env.RPC_PROVIDER, ...prevSettings, ...settings };
  saveSettingsToConfigFile(role, settings, nextSettings);
  return nextSettings;
};

const setMinimalServerSettings = (role, settings) => { };

module.exports = {
  getServerSettings,
  setServerSettings,
  setMinimalServerSettings,
};
