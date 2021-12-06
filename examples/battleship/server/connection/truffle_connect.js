const contract = require('truffle-contract');
const shield_artifact = require('./Shield.json')
const verifier_artifact = require('./Verifier.json')
const { getShieldAddress } = require('../baseline/workgroupRegistry')

const Web3Utils = require('web3-utils');

var Shield = contract(shield_artifact)
var Verifier = contract(verifier_artifact)

module.exports = {
  deploy: async function(callback) {
    var self = this;
    Verifier.setProvider(self.web3.currentProvider);
    Shield.setProvider(self.web3.currentProvider);

    self.web3.eth.getAccounts(async (err, accs) => {
      if (err != null) {
        console.log("There was an error fetching your accounts.", err);
        callback([])
        return;
      }
      if (accs.length == 0) {
        console.log("Couldn't get any accounts! Make sure your Ethereum client is configured correctly.");
        return;
      }
      self.accounts = accs;
      self.account = self.accounts[2];

      const verifierInstance = await Verifier.new({from: self.account, gas: 3000000})
      const shieldInstance = await Shield.new(verifierInstance.address, 0, {from: self.account, gas: 3000000});
      // TODO: update workgroup shield address with shieldInstance.address
      callback(shieldInstance.address);
    })
  },
  start: function(callback) {
    var self = this;
    Shield.setProvider(self.web3.currentProvider);

    self.web3.eth.getAccounts(function(err, accs) {
      if (err != null) {
        console.log("There was an error fetching your accounts.", err);
        callback([])
        return;
      }

      if (accs.length == 0) {
        console.log("Couldn't get any accounts! Make sure your Ethereum client is configured correctly.");
        return;
      }
      self.accounts = accs;
      self.account = self.accounts[2];

      callback(self.accounts);
    });
  },
  verify: async function(a, b, c, publicInputs, workgroupId, callback) {
    var self = this;

    const shieldContractAddress = getShieldAddress(workgroupId)
    console.log('shield address ', shieldContractAddress)
    Shield.setProvider(self.web3.currentProvider);
    const deployed = await Shield.at(shieldContractAddress)

    // TODO: verify sha3 method here, for now just hashing public inputs
    const commitment = Web3Utils.sha3(Web3Utils.toHex(publicInputs));
    const res = await deployed.verifyAndPush.call(a, b, c, publicInputs, commitment, { from: self.account })
    callback(res)
  },
}
