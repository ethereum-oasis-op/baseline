import { expect } from "chai";
import { AgreementAlt } from "../bpi/components/zkmock/agreementalt";
import { MerkleTree } from "merkletreejs";
import { OrderAlt } from "../bpi/components/zkmock/orderalt";
import sha256 = require("crypto-js/sha256");

describe("ZK agreement behaviour", () => {
  describe("Bob places a valid order, it is added to the bpi and the committed state reflects the new BPI agreement state.", () => {
    let agreement: AgreementAlt;
    let agreementStateTree;
    let productTree;
    let orderTree;

    before("Initialize and deploy the Agreement State", () => {
      agreement = new AgreementAlt("alice", "bob", ["cup1", "plate2"]);
      agreement.deployShield();
    });
    it("Deploying the shield of the Agreement State should merkleize it", () => {
      [agreementStateTree, productTree, orderTree] = agreement.merkleizeState();

      const agreementStateRoot = agreementStateTree.getRoot();
      const agreementStateCommitment = Buffer.from(
        sha256(agreementStateRoot + "salt").toString(),
        "hex"
      );

      expect(agreementStateCommitment).to.be.eql(
        agreement.shield.agreementStateCommitment
      );
    });
    it("Merkleizing the Agreement state should create a product merkle tree", () => {
      const productRoot = productTree.getRoot().toString("hex");
      const productLeaf = sha256("cup1");
      const productTreeProof = productTree.getProof(productLeaf);

      expect(productTree.verify(productTreeProof, productLeaf, productRoot)).to
        .be.true;
    });
    it("Merkleizing the Agreement state should create an empty order merkle tree", () => {
      const orderLeaves = orderTree.getLeaves();
      expect(orderLeaves.length).to.be.eql(0);
    });
    it("Merkleizing the Agreement state should create an agreement state merkle tree", () => {
      const agreementStateRoot = agreementStateTree.getRoot().toString("hex");

      //AgreementStateTree leaves include buyerPK, sellerPK, productTree root and orderTree root.
      const agreementStateLeaf = agreement.buyerPK;
      const agreementStateTreeProof =
        agreementStateTree.getProof(agreementStateLeaf);

      expect(
        agreementStateTree.verify(
          agreementStateTreeProof,
          agreementStateLeaf,
          agreementStateRoot
        )
      ).to.be.true;
    });
  });
});
