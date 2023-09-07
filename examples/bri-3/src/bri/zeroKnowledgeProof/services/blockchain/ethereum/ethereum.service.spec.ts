import { EthereumService } from './ethereum.service';
jest.useFakeTimers();

describe('Ethereum services', () => {
  let ccsm: EthereumService;

  //REMOVE THIS
  it('empty test', async () => {
    expect('empty').toBe('empty');
  });

  //NOTE: Commenting out the test as it requires compiled artifacts to run. RUN THIS.

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
