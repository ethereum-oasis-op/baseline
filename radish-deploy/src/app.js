const Settings = require('./utils/settings');
const ethers = require('./utils/ethers');

// const getBuyerSettings = () => Settings.getServerSettings('buyer');
// const getSupplier1Settings = () => Settings.getServerSettings('supplier1');
// const getSupplier2Settings = () => Settings.getServerSettings('supplier2');
// const getSupplier3Settings = () => Settings.getServerSettings('supplier3');

const main = async () => {
  const buyerSettings = await Settings.getServerSettings('buyer');
  const supplier1Settings = await Settings.getServerSettings('supplier1');
  const supplier2Settings = await Settings.getServerSettings('supplier2');
  const supplier3Settings = await Settings.getServerSettings('supplier3');

  await ethers.getProvider(process.env.RPC_PROVIDER);

  if (
    !buyerSettings.organizationRegistryAddress ||
    !buyerSettings.globalRegistryAddress ||
    !supplier1Settings.organizationRegistryAddress ||
    !supplier1Settings.globalRegistryAddress ||
    !supplier2Settings.organizationRegistryAddress ||
    !supplier2Settings.globalRegistryAddress ||
    !supplier3Settings.organizationRegistryAddress ||
    !supplier3Settings.globalRegistryAddress
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
