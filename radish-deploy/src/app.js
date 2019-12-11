const Settings = require('./utils/settings');
const ethers = require('./utils/ethers');

const getBuyerSettings = () => Settings.getServerSettings('buyer');
const getSupplier1Settings = () => Settings.getServerSettings('supplier1');
const getSupplier2Settings = () => Settings.getServerSettings('supplier2');
const getSupplier3Settings = () => Settings.getServerSettings('supplier3');

const main = async () => {
  const buyerSettings = await getBuyerSettings();
  const supplier1Settings = await getSupplier1Settings();
  const supplier2Settings = await getSupplier2Settings();
  const supplier3Settings = await getSupplier3Settings();

  await ethers.getProvider(process.env.RPC_PROVIDER);

  if (
    !buyerSettings.orgRegistryAddress ||
    !buyerSettings.registryAddress ||
    !supplier1Settings.orgRegistryAddress ||
    !supplier1Settings.registryAddress ||
    !supplier2Settings.orgRegistryAddress ||
    !supplier2Settings.registryAddress ||
    !supplier3Settings.orgRegistryAddress ||
    !supplier3Settings.registryAddress
  ) {
    console.log(`
    
      ❌  Note: You have not run the deployment script yet!
      ====================================================
      enter 'npm run deploy' from the radish root directory

    `);
    process.exit(1);
  } else {
    console.log(`
      
      ✅  Bootstrap deployment already established!
      ====================================================
      only do 'npm run deploy' if you want to refresh the contracts

    `);
    process.exit();
  }
};

main();
