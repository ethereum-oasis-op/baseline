var Verifier = artifacts.require("./Verifier.sol");

module.exports = function(deployer) {
  deployer.deploy(Verifier);
};
