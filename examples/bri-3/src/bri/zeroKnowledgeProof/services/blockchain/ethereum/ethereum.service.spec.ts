import { EthereumService } from './ethereum.service';

describe('Ethereum services', () => {
  let ccsm: EthereumService;

  //NOTE: Commenting out the test as it requires compiled artifacts to run

  //   beforeAll(async () => {
  //     ccsm = new EthereumService();
  //     await ccsm.deployContract('Ccsm');
  //   });

  //   describe('storeAnchorHash', () => {
  //     it('should set anchor hash in the mapping and return true', async () => {
  //       //Arrange
  //       const anchorHash = 'anchorHash';

  //       //Act
  //       await ccsm.storeAnchorHash('Ccsm', anchorHash);
  //       const ccsmContract = await ccsm.connectToContract('Ccsm');

  //       //Assert
  //       //expect(await ccsmContract.anchorHashStore('anchorHash')).toEqual(true);
  //     });
  //   });
});
