import { ethers } from 'hardhat';

describe('Ccsm contract', () => {
  describe('setAnchorHash', () => {
    it('should set anchor hash in the mapping and return true', async () => {
      const Ccsm = await ethers.getContractFactory('Ccsm');
      const ccsm = await Ccsm.deploy();

      await ccsm.setAnchorHash('anchorHash1');

      expect(await ccsm.anchorHashStore('anchorHash1')).toEqual(true);
    });
  });
  describe('getAnchorHash', () => {
    it('should return true if anchor hash exists', async () => {
      const Ccsm = await ethers.getContractFactory('Ccsm');
      const ccsm = await Ccsm.deploy();

      await ccsm.setAnchorHash('anchorHash2');

      expect(await ccsm.getAnchorHash('anchorHash2')).toEqual(true);
    });

    it('should return false if anchor hash does not exists', async () => {
      const Ccsm = await ethers.getContractFactory('Ccsm');
      const ccsm = await Ccsm.deploy();

      expect(await ccsm.getAnchorHash('anchorHash3')).toEqual(false);
    });
  });
});
