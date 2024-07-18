const hre = require("hardhat");

async function main() {
  const [owner, adminAccount] = await hre.ethers.getSigners();

  const CcsmBpiStateAnchor = await hre.ethers.getContractFactory("CcsmBpiStateAnchor");

  const ccsmBpiStateAnchor = await CcsmBpiStateAnchor.deploy([
    await owner.getAddress(),
    await adminAccount.getAddress(),
  ]);

  console.log("CcsmBpiStateAnchor deployed to:", await ccsmBpiStateAnchor.getAddress());
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });