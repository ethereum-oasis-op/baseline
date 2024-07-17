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
      const workgroupdId = '123';
      const anchorHash = 'anchorHash';

      //Act
      await ccsm.storeAnchorHash(workgroupdId, anchorHash);
      const ccsmContract = await ccsm.connectToContract({ readonly: true });

      //Assert
      expect(await ccsmContract.anchorHashStore(workgroupdId)).toEqual(
        anchorHash,
      );
    });
  });
  describe('getAnchorHash', () => {
    it('should get anchor hash of the workgroupId from the mapping', async () => {
      //Arrange
      const workgroupdId = '123';
      const anchorHash = 'anchorHash';

      //Act
      const response = await ccsm.getAnchorHash(workgroupdId);

      //Assert
      expect(response).toEqual(anchorHash);
    });
  });
});
