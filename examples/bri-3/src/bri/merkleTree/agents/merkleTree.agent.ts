import { Injectable } from '@nestjs/common';
import { v4 } from 'uuid';
import { BpiMerkleTree } from '../models/bpiMerkleTree';
import { MerkleTreeStorageAgent } from './merkleTreeStorage.agent';
import { MERKLE_TREE_NOT_FOUND } from '../api/err.messages';
import MerkleTree from 'merkletreejs';
import * as crypto from 'crypto';

@Injectable()
export class MerkleTreeAgent {
  constructor(private storageAgent: MerkleTreeStorageAgent) {}
  public createNewMerkleTree(
    leaves: string[],
    hashAlgName: string,
  ): BpiMerkleTree {
    return new BpiMerkleTree(
      v4(),
      hashAlgName,
      this.formMerkleTree(leaves, hashAlgName),
    );
  }

  public updateMerkleTree(
    merkleTreeToUpdate: BpiMerkleTree,
    leaves: string[],
    hashAlgName: string,
  ) {
    merkleTreeToUpdate.updateMerkleTree(
      hashAlgName,
      this.formMerkleTree(leaves, hashAlgName),
    );
  }

  public async fetchMerkleTreeCandidateByIdAndThrowIfValidationFails(
    id: string,
  ): Promise<BpiMerkleTree> {
    const merkleTreeCandidate = await this.storageAgent.getMerkleTreeById(id);

    if (!merkleTreeCandidate) {
      throw new Error(MERKLE_TREE_NOT_FOUND(id));
    }

    return merkleTreeCandidate;
  }

  public formMerkleTree(leaves: string[], hashAlgName: string): MerkleTree {
    const hashHelper = (data: any): Buffer => {
      return crypto.createHash(hashAlgName).update(data).digest();
    };
    const hashedLeaves = leaves.map((x) => hashHelper(x));
    return new MerkleTree(hashedLeaves, hashHelper);
  }
}
