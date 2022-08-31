import { IMerkleTree, Tree } from "./merkleTree.interface";
import { PreciseProofs } from "ew-precise-proofs-js";

export class MerkleTree implements IMerkleTree {
  tree: Tree;

  createLeaves(document: any): PreciseProofs.Leaf[] {
    try {
      const leaves = PreciseProofs.createLeafs(document);
      return leaves;
    } catch (e) {
      console.log("Leaves not created");
      console.log(e);
    }
  }
  createTree(leaves: PreciseProofs.Leaf[]): any[] {
    try {
      const merkleTree = PreciseProofs.createMerkleTree(
        leaves.map((leaf: PreciseProofs.Leaf) => leaf.hash)
      );
      return merkleTree;
    } catch (e) {
      console.log("Tree not created");
      console.log(e);
    }
  }

  createRoot(leaves: PreciseProofs.Leaf[], merkleTree: any[]): string {
    try {
      const rootHash = PreciseProofs.getRootHash(merkleTree);
      const schema = leaves.map((leaf: PreciseProofs.Leaf) => leaf.key);
      const extendedTreeRootHash = PreciseProofs.createExtendedTreeRootHash(
        rootHash,
        schema
      );
      return extendedTreeRootHash;
    } catch (e) {
      console.log("Root not created");
      console.log(e);
    }
  }

  getRoot(document: any): string {
    try {
      const leaves = this.createLeaves(document);
      const merkleTree = this.createTree(leaves);
      const root = this.createRoot(leaves, merkleTree);
      return root;
    } catch (e) {
      console.log("Unable to get root");
      console.log(e);
    }
  }
}
