import { deployCcsmContract } from './scripts/deploy';
import { EthereumService } from './ethereum.service';

describe('Ethereum services', () => {
  let ccsm: EthereumService;
  beforeAll(async () => {
    await deployCcsmContract();
    ccsm = new EthereumService();
  });
  describe('setAnchorHash', () => {
    it('should set anchor hash in the mapping and return true', async () => {
      await ccsm.storeAnchorHash('anchorHash');

      expect(await ccsm.verifyIfAnchorHashExists('anchorHash')).toEqual(
        'anchorHash',
      );
    });
  });
});
