const { ethers, network } = require('hardhat')

async function main() {
    console.log(`Deploying Baselined Battleship Contract on: ${network.name}`)
    const ZKBattleshipFactory = await ethers.getContractFactory('ZKBattleship');
    const instance = await ZKBattleshipFactory.deploy()
    await instance.deployed()
    console.log(`Deployed ZKBattleship Instance to ${instance.address}`)
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
