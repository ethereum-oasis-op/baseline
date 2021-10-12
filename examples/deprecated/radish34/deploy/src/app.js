const SettingsReader = require('./utils/SettingsReader');
const { logger } = require('radish34-logger');

const main = async () => {
  const settingsReader = new SettingsReader(process.env.ORGANISATION_CONFIG_PATH);
  const buyerSettings = await settingsReader.resolveSettings('buyer');
  const supplier1Settings = await settingsReader.resolveSettings('supplier1');
  const supplier2Settings = await settingsReader.resolveSettings('supplier2');

  if (
    !buyerSettings.addresses.OrgRegistry ||
    !buyerSettings.addresses.ERC1820Registry ||
    !supplier1Settings.addresses.OrgRegistry ||
    !supplier1Settings.addresses.ERC1820Registry ||
    !supplier2Settings.addresses.OrgRegistry ||
    !supplier2Settings.addresses.ERC1820Registry
  ) {
    logger.warning(`

      ❌  Note: You have not run the deployment script yet!
      ======================================================
      Enter 'npm run deploy' from the radish root directory.

    `, {service: 'DEPLOY'});
    process.exit(1);
  } else {
    logger.info(`

      ✅  Bootstrap deployment already established!
      ==============================================================
      Only do 'npm run deploy' if you want to refresh the contracts.

    `, {service: 'DEPLOY'});
    process.exit();
  }
};

main();
