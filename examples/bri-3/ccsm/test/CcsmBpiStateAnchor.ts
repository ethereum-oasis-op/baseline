import {
  loadFixture,
} from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { expect } from "chai";
import hre from "hardhat";

describe("CcsmBpiStateAnchor", function () {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
  async function deployCcsmBpiStateAnchor() {
    // Contracts are deployed using the first signer/account by default
    const [owner, otherAccount] = await hre.ethers.getSigners();

    const CcsmBpiStateAnchor = await hre.ethers.getContractFactory("CcsmBpiStateAnchor");
    const ccsmBpiStateAnchor = await CcsmBpiStateAnchor.deploy([await owner.getAddress()]);

    return { ccsmBpiStateAnchor, owner, otherAccount };
  }

  describe("Deployment", function () {
    it("Should deploy the contract", async function () {
      const { ccsmBpiStateAnchor, owner, otherAccount } = await loadFixture(deployCcsmBpiStateAnchor);

      expect(await ccsmBpiStateAnchor.getAddress()).not.to.equal(undefined);
    });
  });
});
