export interface IMerkleTree {
  tree: Tree;
  getRoot: (document: any) => string;
}

export type Tree = {
  leaves: string[];
  root: string;
};
