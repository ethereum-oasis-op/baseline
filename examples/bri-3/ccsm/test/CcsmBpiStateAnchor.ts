import { loadFixture } from '@nomicfoundation/hardhat-toolbox/network-helpers';
import { expect } from 'chai';
import hre from 'hardhat';

describe('CcsmBpiStateAnchor', function () {
  async function deployCcsmBpiStateAnchor() {
    const [owner, otherAccount, adminAccount] = await hre.ethers.getSigners();

    const CcsmBpiStateAnchor = await hre.ethers.getContractFactory(
      'CcsmBpiStateAnchor',
    );
    const ccsmBpiStateAnchor = await CcsmBpiStateAnchor.deploy([
      await owner.getAddress(),
      await adminAccount.getAddress(),
    ]);

    return { ccsmBpiStateAnchor, owner, otherAccount, adminAccount };
  }

  describe('Deployment', function () {
    it('Should deploy the contract', async function () {
      const { ccsmBpiStateAnchor } = await loadFixture(
        deployCcsmBpiStateAnchor,
      );
      expect(await ccsmBpiStateAnchor.getAddress()).to.be.properAddress;
    });

    it('Should set the correct admin roles', async function () {
      const { ccsmBpiStateAnchor, owner, adminAccount } = await loadFixture(
        deployCcsmBpiStateAnchor,
      );
      const adminRole = await ccsmBpiStateAnchor.ADMIN_ROLE();
      expect(await ccsmBpiStateAnchor.hasRole(adminRole, owner.address)).to.be
        .true;
      expect(await ccsmBpiStateAnchor.hasRole(adminRole, adminAccount.address))
        .to.be.true;
    });
  });

  describe('setAnchorHash', function () {
    it('Should allow an admin to set an anchor hash', async function () {
      const { ccsmBpiStateAnchor, owner } = await loadFixture(
        deployCcsmBpiStateAnchor,
      );
      const workgroupId = 'testWorkgroup';
      const anchorHash = '0x1234567890abcdef';

      await expect(
        ccsmBpiStateAnchor
          .connect(owner)
          .setAnchorHash(workgroupId, anchorHash),
      )
        .to.emit(ccsmBpiStateAnchor, 'AnchorHashSet')
        .withArgs(workgroupId, anchorHash);

      expect(await ccsmBpiStateAnchor.anchorHashStore(workgroupId)).to.equal(
        anchorHash,
      );
    });

    it('Should not allow a non-admin to set an anchor hash', async function () {
      const { ccsmBpiStateAnchor, otherAccount } = await loadFixture(
        deployCcsmBpiStateAnchor,
      );
      const workgroupId = 'testWorkgroup';
      const anchorHash = '0x1234567890abcdef';

      await expect(
        ccsmBpiStateAnchor
          .connect(otherAccount)
          .setAnchorHash(workgroupId, anchorHash),
      ).to.be.revertedWith('Only admin can call this function');
    });

    it('Should revert when workgroupId is empty', async function () {
      const { ccsmBpiStateAnchor, owner } = await loadFixture(
        deployCcsmBpiStateAnchor,
      );
      const anchorHash = '0x1234567890abcdef';

      await expect(
        ccsmBpiStateAnchor.connect(owner).setAnchorHash('', anchorHash),
      ).to.be.revertedWith('WorkgroupId cannot be empty');
    });

    it('Should revert when workgroupId exceeds 36 bytes', async function () {
      const { ccsmBpiStateAnchor, owner } = await loadFixture(
        deployCcsmBpiStateAnchor,
      );
      const longWorkgroupId = 'a'.repeat(37);
      const anchorHash = '0x1234567890abcdef';

      await expect(
        ccsmBpiStateAnchor
          .connect(owner)
          .setAnchorHash(longWorkgroupId, anchorHash),
      ).to.be.revertedWith('WorkgroupId cannot exceed 36 bytes');
    });

    it('Should revert when anchorHash is empty', async function () {
      const { ccsmBpiStateAnchor, owner } = await loadFixture(
        deployCcsmBpiStateAnchor,
      );
      const workgroupId = 'testWorkgroup';

      await expect(
        ccsmBpiStateAnchor.connect(owner).setAnchorHash(workgroupId, ''),
      ).to.be.revertedWith('AnchorHash cannot be empty');
    });

    it('Should revert when anchorHash exceeds 256 bytes', async function () {
      const { ccsmBpiStateAnchor, owner } = await loadFixture(
        deployCcsmBpiStateAnchor,
      );
      const workgroupId = 'testWorkgroup';
      const longAnchorHash = '0x' + 'a'.repeat(257);

      await expect(
        ccsmBpiStateAnchor
          .connect(owner)
          .setAnchorHash(workgroupId, longAnchorHash),
      ).to.be.revertedWith('AnchorHash cannot exceed 256 bytes');
    });
  });

  describe('getAnchorHash', function () {
    it('Should return the correct anchor hash for a given workgroupId', async function () {
      const { ccsmBpiStateAnchor, owner } = await loadFixture(
        deployCcsmBpiStateAnchor,
      );
      const workgroupId = 'testWorkgroup';
      const anchorHash = '0x1234567890abcdef';

      await ccsmBpiStateAnchor
        .connect(owner)
        .setAnchorHash(workgroupId, anchorHash);
      expect(await ccsmBpiStateAnchor.getAnchorHash(workgroupId)).to.equal(
        anchorHash,
      );
    });

    it('Should return an empty string for a non-existent workgroupId', async function () {
      const { ccsmBpiStateAnchor } = await loadFixture(
        deployCcsmBpiStateAnchor,
      );
      const nonExistentWorkgroupId = 'nonExistent';

      expect(
        await ccsmBpiStateAnchor.getAnchorHash(nonExistentWorkgroupId),
      ).to.equal('');
    });
  });

  describe('AccessControl', function () {
    it('Should allow the owner to grant admin role', async function () {
      const { ccsmBpiStateAnchor, owner, otherAccount } = await loadFixture(
        deployCcsmBpiStateAnchor,
      );
      const adminRole = await ccsmBpiStateAnchor.ADMIN_ROLE();

      await expect(
        ccsmBpiStateAnchor
          .connect(owner)
          .grantRole(adminRole, otherAccount.address),
      ).to.not.be.reverted;

      expect(await ccsmBpiStateAnchor.hasRole(adminRole, otherAccount.address))
        .to.be.true;
    });

    it('Should allow the owner to revoke admin role', async function () {
      const { ccsmBpiStateAnchor, owner, adminAccount } = await loadFixture(
        deployCcsmBpiStateAnchor,
      );
      const adminRole = await ccsmBpiStateAnchor.ADMIN_ROLE();

      await expect(
        ccsmBpiStateAnchor
          .connect(owner)
          .revokeRole(adminRole, adminAccount.address),
      ).to.not.be.reverted;

      expect(await ccsmBpiStateAnchor.hasRole(adminRole, adminAccount.address))
        .to.be.false;
    });
  });
});
