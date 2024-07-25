const hre = require("hardhat");

async function main() {
  const [originalOwner] = await hre.ethers.getSigners();

  // use internal bpi subject account as the owner of the CcsmBpiStateAnchor contract
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

  // deploy verifier contracts for 3 worksteps from the e2e use-case.
  // in practice, they would be deployed by however is setting up the workflow
  // and only contract addresses would be added to the workstep
  const Workstep1Verifier = await hre.ethers.getContractFactory("Workstep1Verifier");

  const workstep1Verifier = await Workstep1Verifier.deploy();

  console.log("Workstep1Verifier deployed to:", await workstep1Verifier.getAddress());

  const Workstep2Verifier = await hre.ethers.getContractFactory("Workstep2Verifier");

  const workstep2Verifier = await Workstep2Verifier.deploy();

  console.log("Workstep2Verifier deployed to:", await workstep2Verifier.getAddress());

  const Workstep3Verifier = await hre.ethers.getContractFactory("Workstep3Verifier");

  const workstep3Verifier = await Workstep3Verifier.deploy();

  console.log("Workstep3Verifier deployed to:", await workstep3Verifier.getAddress());
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });