import { ethers } from 'ethers';
import { baselineProviderProvide, baselineServiceFactory } from '../src/index';

const defaultAccountAddress = '0x7e5f4552091a69125d5dfcb7b8c2659029395bdf';

let bearerToken;
let provide;

beforeEach(async () => {
  provide = await baselineServiceFactory(baselineProviderProvide);
});

afterEach(async () => {
  bearerToken = null;
  provide = null;
});

describe('baseline rpc', () => {
  let sender;

  const deployShield = async () => {
    // deploy EYBlockchain's MerkleTreeSHA contract (see https://github.com/EYBlockchain/timber)
    const txhash = await provide.rpcExec('baseline_deploy', [sender, 'MerkleTreeSHA']);
    expect(txhash).not.toBe(null);
    expect(txhash.length).toBe(66);

    const receipt = await provide.fetchTxReceipt(txhash);
    expect(receipt).not.toBe(null);
    expect(receipt.contractAddress).not.toBe(null);
    expect(receipt.contractAddress.length).toBe(42);
    return receipt.contractAddress;
  };

  beforeEach(async () => {
    sender = defaultAccountAddress;
  });
  
  afterEach(async () => {
    sender = null;
  });

  describe('off-chain merkle tree tracking', () => {
    describe('when no shield contract has been deployed to the given address', () => {
      it('should return false to indicate no new merkle tree is being tracked or persisted', async () => {
        const call = provide.track('0xD16EEdE029C5c062255F1A37fa33b9D77BFC3282'); // no shield contract here...
        await expect(call).rejects.toBeTruthy();
      });
    });

    describe('when the given address is a valid merkle tree shield contract', () => {
      let shield;
      let result;

      beforeEach(async () => {
        shield = await deployShield();
        result = await provide.track(shield);
      });

      it('should return true to indicate a new merkle tree db was created and tracking started', async () => {
        expect(result).toBe(true);
      });

      describe('inserting a leaf', () => {
        let leaf;

        beforeEach(async () => {
          leaf = ethers.utils.keccak256(ethers.utils.hexlify(ethers.utils.toUtf8Bytes(`${new Date().getTime()}`)));
          const insertResult = await provide.verifyAndPush(sender, shield, leaf);
          expect(insertResult).not.toBe(null);
        });

        it('should create a valid root in the tree', async () => {
          const root = await provide.getRoot(shield);
          expect(root).not.toBe(null);
          expect(root.length).toBe(66);
        });

        it('should expose the leaf in the tree', async () => {
          const leafResp = await provide.getCommit(shield, 0);
          expect(leafResp).not.toBe(null);
          expect(leafResp.hash).toBe(leaf);
          expect(leafResp.nodeIndex).not.toBe(null);
        });

        it('should expose the leaves in the tree', async () => {
          const leavesResp = await provide.getCommits(shield, [0]);
          expect(leavesResp).not.toBe(null);
          expect(leavesResp.length).toBe(1);
          expect(leavesResp[0].hash).toBe(leaf);
          expect(leavesResp[0].nodeIndex).not.toBe(null);
        });

        it('should expose the sibling paths of the leaf', async () => {
          const siblings = await provide.getSiblings(shield, 0);
          expect(siblings).not.toBe(null);
          expect(siblings.length).toBe(32);
        });

        describe('verification of a leaf against a root and siblings path', () => {
          let root;
          let siblings;

          beforeEach(async () => {
            root = await provide.getRoot(shield);
            siblings = await provide.getSiblings(shield, 0);
          });

          describe('when the given leaf should not be verified against the root and siblings', () => {
            beforeEach(async () => {
              leaf = ethers.utils.keccak256(ethers.utils.hexlify(ethers.utils.toUtf8Bytes(`${new Date().getTime() * 2}`)));
            });

            it('should not verify the leaf against the root and sibling paths', async () => {
              const verified = await provide.verify(shield, root, leaf, siblings);
              expect(verified).toBe(false);
            });
          });

          describe('when the given leaf can be verified against the root and siblings', () => {
            it('should verify a leaf against the root and sibling paths', async () => {
              const verified = await provide.verify(shield, root, leaf, siblings);
              expect(verified).toBe(true);
            });
          });
        });
      });
    });

    describe('untrack', () => {
      let shield;
      let result;

      beforeEach(async () => {
        shield = await deployShield();
        result = await provide.track(shield);
        expect(result).toBe(true);
      });

      it('should stop tracking the merkle tree', async () => {
        const resp = await provide.untrack(shield.address, false);
        await expect(resp).toBe(true);
        // TODO: assert the tree is no longer receiving events;
        // the above only asserts the baseline API response was valid
      });

      describe('when no shield contract has been deployed to the given address', () => {
        it('should return false to indicate no new merkle tree was being tracked or persisted', async () => {
          const call = provide.untrack('0xD16EEdE029C5c062255F1A37fa33b9D77BFC3282', false); // no shield contract here...
          await expect(call).rejects.toBeTruthy();
        });
      });
    });
  });
});

describe('registry', () => {

});

describe('vault', () => {

});
