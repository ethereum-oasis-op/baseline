import { ethers } from 'ethers';
import { RpcClient } from 'provide-js';

const defaultAccountAddress = '0x7e5f4552091a69125d5dfcb7b8c2659029395bdf';

let client;
let sender;

const deployShield = async () => {
  // deploy EYBlockchain's MerkleTreeSHA contract (see https://github.com/EYBlockchain/timber)
  const txhash = await client.call('baseline_deploy', [sender, 'MerkleTreeSHA']);
  expect(txhash).not.toBe(null);
  expect(txhash.length).toBe(66);

  const receipt = await client.call('eth_getTransactionReceipt', [txhash]);
  expect(receipt).not.toBe(null);
  expect(receipt.contractAddress).not.toBe(null);
  expect(receipt.contractAddress.length).toBe(42);
  return receipt.contractAddress;
};

beforeEach(async () => {
  sender = defaultAccountAddress;
  client = new RpcClient();
});

afterEach(async () => {
  sender = null;
  client = null;
});

describe('off-chain merkle tree tracking', () => {
  describe('when no shield contract has been deployed to the given address', () => {
    it('should return false to indicate no new merkle tree is being tracked or persisted', async () => {
      const result = await client.call('baseline_track', ['0xD16EEdE029C5c062255F1A37fa33b9D77BFC3282']); // no shield contract here...
      expect(result).toBe(false);
    });
  });

  describe('when the given address is a valid merkle tree shield contract', () => {
    let shield;
    let result;

    beforeEach(async () => {
      shield = await deployShield();
      result = await client.call('baseline_track', [shield]);
    });

    it('should return true to indicate a new merkle tree db was created and tracking started', async () => {
      expect(result).toBe(true);
    });

    describe('inserting a leaf', () => {
      let leaf;

      beforeEach(async () => {
        leaf = ethers.utils.keccak256(ethers.utils.hexlify(ethers.utils.toUtf8Bytes(`${new Date().getTime()}`)));
        const insertResult = await client.call('baseline_insertLeaf', [sender, shield, leaf]);
        expect(insertResult).not.toBe(null);
      });

      it('should create a valid root in the tree', async () => {
        const root = await client.call('baseline_getRoot', [shield]);
        expect(root).not.toBe(null);
        expect(root.length).toBe(66);
      });

      it('should expose the leaf in the tree', async () => {
        const leafResp = await client.call('baseline_getLeaf', [shield, 0]);
        expect(leafResp).not.toBe(null);
        expect(leafResp.hash).toBe(leaf);
        expect(leafResp.nodeIndex).not.toBe(null);
      });

      it('should expose the leaves in the tree', async () => {
        const leavesResp = await client.call('baseline_getLeaves', [shield, [0]]);
        expect(leavesResp).not.toBe(null);
        expect(leavesResp.length).toBe(1);
        expect(leavesResp[0].hash).toBe(leaf);
        expect(leavesResp[0].nodeIndex).not.toBe(null);
      });

      it('should expose the sibling paths of the leaf', async () => {
        const siblings = await client.call('baseline_getSiblings', [shield, 0]);
        expect(siblings).not.toBe(null);
        expect(siblings.length).toBe(32);
      });

      describe('verification of a leaf against a root and siblings path', () => {
        let root;
        let siblings;

        beforeEach(async () => {
          root = await client.call('baseline_getRoot', [shield]);
          siblings = await client.call('baseline_getSiblings', [shield, 0]);
        });

        describe('when the given leaf should not be verified against the root and siblings', () => {
          beforeEach(async () => {
            leaf = ethers.utils.keccak256(ethers.utils.hexlify(ethers.utils.toUtf8Bytes(`${new Date().getTime() * 2}`)));
          });

          it('should not verify the leaf against the root and sibling paths', async () => {
            const verified = await client.call('baseline_verify', [shield, root, leaf, siblings]);
            expect(verified).toBe(false);
          });
        });

        describe('when the given leaf can be verified against the root and siblings', () => {
          it('should verify a leaf against the root and sibling paths', async () => {
            const verified = await client.call('baseline_verify', [shield, root, leaf, siblings]);
            expect(verified).toBe(true);
          });
        });
      });
    });
  });
});
