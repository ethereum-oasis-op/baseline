import { Tree } from './tree.interface';
import { PreciseProofs } from 'ew-precise-proofs-js';

export class MerkleTree {
  private tree: Tree = { leaves: [], root: undefined };

  constructor(document: any) {
    this.initTree(document);
  }

  private initTree(document: any): Tree {
    try {
      if (!document) {
        return;
      }

      const leaves: PreciseProofs.Leaf[] = PreciseProofs.createLeafs(document);

      const merkleTree = PreciseProofs.createMerkleTree(
        leaves.map((leaf: PreciseProofs.Leaf) => leaf.hash),
      );
      const root = PreciseProofs.getRootHash(merkleTree);

      this.tree.leaves = leaves;
      this.tree.root = root;
    } catch (e) {
      // TODO: replace with logger once we agree on method and library
      console.log(`Init tree error: ${e}`);
    }
  }

  get leaves() {
    return this.tree.leaves;
  }

  get root() {
    return this.tree.root;
  }
}
