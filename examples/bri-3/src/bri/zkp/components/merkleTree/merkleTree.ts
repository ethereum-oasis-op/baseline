import { Tree } from "./tree"
import { IMerkleTree} from "./merkleTree.interface";
import { PreciseProofs } from "ew-precise-proofs-js";

class MerkleTree implements IMerkleTree {
  tree: Tree;

  constructor(document: any){
    const merkleTree: Tree = this.createTree(document);

    this.tree.leaves = merkleTree.leaves;
    this.tree.root = merkleTree.root; 
  }

  createTree(document: any): Tree {
    try {
      var tree: Tree;

      const leaves: PreciseProofs.Leaf[] = this.createLeaves(document);

      const merkleTree = PreciseProofs.createMerkleTree(
        leaves.map((leaf: PreciseProofs.Leaf) => leaf.hash)
      );

      const root = PreciseProofs.getRootHash(merkleTree);
      
      tree.leaves = leaves;
      tree.root = root;

      return tree;
    } catch (e) {
      console.log("Tree not created");
      console.log(e);
    }
  }

  createLeaves(document: any): PreciseProofs.Leaf[] {
    try {
      const leaves = PreciseProofs.createLeafs(document);
      return leaves;
    } catch (e) {
      console.log("Leaves not created");
      console.log(e);
    }
  }

  getTree(): Tree {
    try {
      return this.tree;
    } catch (e) {
      console.log("Unable to get tree");
      console.log(e);
    }
  }

  getLeaves(): PreciseProofs.Leaf[]{
    try {
      return this.tree.leaves;
    } catch (e) {
      console.log("Unable to get leaves");
      console.log(e);
    } 
  }
   
  getRoot(): string {
    try {
      return this.tree.root
    } catch (e) {
      console.log("Unable to get root");
      console.log(e);
    }
  }
  
}
