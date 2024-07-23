const hre = require("hardhat");

async function main() {
  const [originalOwner] = await hre.ethers.getSigners();

  const ownerAndAdminPrivateKey = "2c95d82bcd8851bd3a813c50afafb025228bf8d237e8fd37ba4adba3a7596d58";
  const ownerAndAdmin = new hre.ethers.Wallet(ownerAndAdminPrivateKey, hre.ethers.provider);

  await originalOwner.sendTransaction({
    to: ownerAndAdmin.address,
    value: hre.ethers.parseEther("1.0")
  });

  const CcsmBpiStateAnchor = await hre.ethers.getContractFactory("CcsmBpiStateAnchor");

  const ccsmBpiStateAnchor = await CcsmBpiStateAnchor.connect(ownerAndAdmin).deploy([
    ownerAndAdmin.address,
    ownerAndAdmin.address,
  ]);

  console.log("CcsmBpiStateAnchor deployed to:", await ccsmBpiStateAnchor.getAddress());
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });