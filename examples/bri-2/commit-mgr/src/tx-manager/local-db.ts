import { updateTree } from '../merkle-tree';
import { ITxManager } from '.';
import { logger } from '../logger';
import { insertLeaf as insertLeafDb, getLatestLeaf } from "../merkle-tree/leaves";

export class LocalDb implements ITxManager {

  constructor(private readonly config: any) {
    this.config = config;
  }

  async insertLeaf(
    merkleId: string,
    fromAddress: string,
    proof: any[],
    publicInputs: any[],
    newCommitment: string
  ) {
    let error = null;
    let txHash;
    try {
      const latestLeaf = await getLatestLeaf(merkleId);
      let newLeafIndex = 0;
      if (latestLeaf) newLeafIndex = latestLeaf.leafIndex+1;

      const newLeaf = {
        leafIndex: newLeafIndex,
        hash: newCommitment
      }
      await insertLeafDb(merkleId, newLeaf);

      // Set txHash to new root hash value
      txHash = await updateTree(merkleId);
    } catch (err) {
      logger.error('Failed to insert leaf into local db:', err);
      error = { data: err };
    }
    return { error, txHash };
  }
}
