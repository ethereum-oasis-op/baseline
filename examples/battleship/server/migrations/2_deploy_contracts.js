var Verifier = artifacts.require("./Verifier.sol")
var Shield = artifacts.require("./Shield.sol");

module.exports = function(deployer) {
  deployer.deploy(Verifier).then(function(){
    return deployer.deploy(Shield, Verifier.address, 0)
  });
};
