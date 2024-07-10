import { EthereumService } from './ethereum.service';

jest.setTimeout(60000);
describe('Ethereum services', () => {
  let ccsm: EthereumService;

  beforeAll(async () => {
    ccsm = new EthereumService();
    await ccsm.deployContract();
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
      expect(await ccsmContract.AnchorHashStore('workgroupId')).toEqual(
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
