import { Injectable } from '@nestjs/common';
import MerkleTree from 'merkletreejs';
import { v4 } from 'uuid';
import { BpiMerkleTree } from '../models/bpiMerkleTree';
import { MerkleTreeStorageAgent } from './merkleTreeStorage.agent';
import * as crypto from 'crypto';

@Injectable()
export class MerkleTreeAgent {
  constructor(private storageAgent: MerkleTreeStorageAgent) {}
  public createNewMerkleTree(
    leaves: string[],
    hashFunction: string,
  ): BpiMerkleTree {
    const hashHelper = (data: any): Buffer => {
      return crypto.createHash(hashFunction).update(data).digest();
    };

    const hashedLeaves = leaves.map((x) => hashHelper(x));

    return new BpiMerkleTree(v4(), new MerkleTree(hashedLeaves, hashHelper));
  }

  public updateMerkleTree(
    merkleTreeToUpdate: BpiMerkleTree,
    leaves: string[],
    hashFunction: string,
  ) {
    const hashHelper = (data: any): Buffer => {
      return crypto.createHash(hashFunction).update(data).digest();
    };

    const hashedLeaves = leaves.map((x) => hashHelper(x));

    merkleTreeToUpdate.updateMerkleTree(hashedLeaves, hashHelper);
  }

  public async fetchMerkleTreeCandidateByIdAndThrowIfValidationFails(
    id: string,
  ): Promise<BpiMerkleTree> {
    const merkleTreeCandidate: BpiMerkleTree =
      await this.storageAgent.getMerkleTreeById(id);

    return merkleTreeCandidate;
  }
}
