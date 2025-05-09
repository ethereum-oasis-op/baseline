module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!
  contracts_directory: './contracts',
  contracts_build_directory: './contracts/artifacts',
  compilers: {
    solc: {
      version: '0.8.5',
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  }
};
