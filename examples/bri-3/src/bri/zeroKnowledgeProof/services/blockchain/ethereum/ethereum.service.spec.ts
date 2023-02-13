import { EthereumService } from './ethereum.service';

describe('Ethereum services', () => {
  let ccsm: EthereumService;

  beforeAll(async () => {
    ccsm = new EthereumService();
    await ccsm.deployContract();
  });

  describe('storeAnchorHash', () => {
    it('should set anchor hash in the mapping and return true', async () => {
      //Arrange
      const ccsmContract = await ccsm.connectToContract();

      //Act
      await ccsm.storeAnchorHash('anchorHash1');

      //Assert
      expect(await ccsmContract.anchorHashStore('anchorHash1')).toEqual(true);
    });
  });

  describe('verifyIfAnchorHashExists', () => {
    it('should return the anchor hash if it exists', async () => {
      //Act
      await ccsm.storeAnchorHash('anchorHash2');

      //Assert
      expect(await ccsm.verifyIfAnchorHashExists('anchorHash2')).toEqual(
        'anchorHash2',
      );
    });

    it('should return null if anchor hash does not exists', async () => {
      //Act
      await ccsm.storeAnchorHash('');

      //Assert
      expect(await ccsm.verifyIfAnchorHashExists('anchorHash3')).toEqual('');
    });
  });
});
