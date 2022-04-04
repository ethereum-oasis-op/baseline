const Verifier = artifacts.require("Verifier");
const Shield = artifacts.require("Shield");

module.exports =  async (deployer) => {
  await deployer.deploy(Verifier);
  await deployer.deploy(Shield, Verifier.address);
};
