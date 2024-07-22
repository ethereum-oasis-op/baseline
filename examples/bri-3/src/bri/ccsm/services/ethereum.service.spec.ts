import { EthereumService } from './ethereum.service';

// jest.setTimeout(60000);
// TODO: These below are not unit tests, they are expecting a deployed contract on sepolia
// We ll do this testing as part of the e2e test in the end so these can be removed
describe.skip('Ethereum services', () => {
  let ccsm: EthereumService;

  beforeAll(async () => {
    ccsm = new EthereumService();
  });

  describe('storeAnchorHash', () => {
    it('should set anchor hash in the mapping', async () => {
      //Arrange
      const workstepInstanceId = '123';
      const anchorHash = 'anchorHash';

      //Act
      await ccsm.storeAnchorHash(workstepInstanceId, anchorHash);
      const ccsmContract = await ccsm.connectToContract();

      //Assert
      expect(await ccsmContract.anchorHashStore(workstepInstanceId)).toEqual(
        anchorHash,
      );
    });
  });
  describe('getAnchorHash', () => {
    it('should get anchor hash of the WorkstepInstanceId from the mapping', async () => {
      //Arrange
      const workstepInstanceId = '123';
      const anchorHash = 'anchorHash';

      //Act
      const response = await ccsm.getAnchorHash(workstepInstanceId);

      //Assert
      expect(response).toEqual(anchorHash);
    });
  });
});
