import { Tree } from "./tree"
export interface IMerkleTree {
  tree: Tree;
  getRoot: (document: any) => string;
}

