import { Tree } from './tree.interface';
import { IMerkleTree } from './merkleTree.interface';
import { PreciseProofs } from 'ew-precise-proofs-js';
import { LoggerManager } from 'typescript-logger';
const log = LoggerManager.create('logger');

export class MerkleTree implements IMerkleTree {
  private tree: Tree;

  constructor(document: any) {
    this.initTree(document);
  }

  private initTree(document: any): Tree {
    try {
      if (!document) {
        return;
      }

      const leaves: PreciseProofs.Leaf[] = this.createLeaves(document);

      if (leaves.length === 0) {
        this.catchError('Empty leaves');
        return;
      }

      const merkleTree = PreciseProofs.createMerkleTree(
        leaves.map((leaf: PreciseProofs.Leaf) => leaf.hash),
      );
      const root = PreciseProofs.getRootHash(merkleTree);

      this.tree.leaves = leaves;
      this.tree.root = root;
    } catch (e) {
      this.catchError(e);
    }
  }

  private createLeaves(document: any): PreciseProofs.Leaf[] {
    try {
      const leaves = PreciseProofs.createLeafs(document);
      return leaves;
    } catch (e) {
      return [];
    }
  }

  getTree(): Tree {
    return this.tree;
  }

  private catchError(e) {
    log.error(`Tree not created: ${e}`);
    this.tree.leaves = [];
    this.tree.root = '';
  }
}
