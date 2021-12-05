const contract = require('truffle-contract');
const verifier_artifact = require('./Verifier.json')

var Verifier = contract(verifier_artifact)

module.exports = {
  deploy: async function(callback) {
    var self = this;
    Verifier.setProvider(self.web3.currentProvider);

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

      const myInstance = await Verifier.new({from: self.account, gas: 3000000});
      // TODO: update workgroup verifier address with myInstance.address
      return myInstance;
    })
  },
  start: function(callback) {
    var self = this;
    Verifier.setProvider(self.web3.currentProvider);

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
  verify: function(a, b, c, input, callback) {
    var self = this;

    Verifier.setProvider(self.web3.currentProvider);

    // TODO: find a better way for this, using it now for account init side effect...
    self.web3.eth.getAccounts(console.log)

    var verifier;
    Verifier.deployed().then(function(instance) {
      verifier = instance;
      return verifier.verifyProof.call(a, b, c, input, { from: self.account })
    }).then(function(value) {
        callback(value.valueOf());
    }).catch(function(e) {
        console.log(e);
        callback("Error when verifying proof");
    });
  },
}
