const Settings = require('./utils/settings');
const ethers = require('./utils/ethers');

// const getBuyerSettings = () => Settings.getServerSettings('buyer');
// const getSupplier1Settings = () => Settings.getServerSettings('supplier1');
// const getSupplier2Settings = () => Settings.getServerSettings('supplier2');

const main = async () => {
  const buyerSettings = await Settings.getServerSettings('buyer');
  const supplier1Settings = await Settings.getServerSettings('supplier1');
  const supplier2Settings = await Settings.getServerSettings('supplier2');

  await ethers.getProvider(process.env.RPC_PROVIDER);

  if (
    !buyerSettings.addresses.OrgRegistry ||
    !buyerSettings.addresses.ERC1820Registry ||
    !supplier1Settings.addresses.OrgRegistry ||
    !supplier1Settings.addresses.ERC1820Registry ||
    !supplier2Settings.addresses.OrgRegistry ||
    !supplier2Settings.addresses.ERC1820Registry
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
