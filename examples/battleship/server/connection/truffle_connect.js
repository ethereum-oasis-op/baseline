const contract = require('truffle-contract');
const shield_artifact = require('./Shield.json')
const verifier_artifact = require('./Verifier.json')

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
  verify: async function(a, b, c, input, address, callback ) {
    var self = this;

    Shield.setProvider(self.web3.currentProvider);
    const deployed = await Shield.at(address)

    // TODO: replace with proper hash of real data
    const testCommitment =  self.web3.sha3(self.web3.padRight(self.web3.fromAscii("test1"), 66), { encoding: 'hex' });
    const res = await deployed.verifyAndPush.call(a, b, c, input, testCommitment, { from: self.account })
    callback(res)
  },
}
