import { Injectable, NotFoundException } from '@nestjs/common';
import { v4 } from 'uuid';
import { BpiMerkleTree } from '../models/bpiMerkleTree';
import { MerkleTreeStorageAgent } from './merkleTreeStorage.agent';
import { MERKLE_TREE_NOT_FOUND } from '../api/err.messages';
import MerkleTree from 'merkletreejs';
import * as crypto from 'crypto';

@Injectable()
export class MerkleTreeAgent {
  constructor(private storageAgent: MerkleTreeStorageAgent) {}

  //TODO add validation that hashAlgName is within a supported list
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
  public async fetchMerkleTreeByIdAndThrowIfValidationFails(
    id: string,
  ): Promise<BpiMerkleTree> {
    const merkleTree = await this.storageAgent.getMerkleTreeById(id);

    if (!merkleTree) {
      throw new NotFoundException(MERKLE_TREE_NOT_FOUND(id));
    }

    return merkleTree;
  }

  //TODO to be moved into BpiMerkleTree Domain Object or Hashing Service
  public formMerkleTree(leaves: string[], hashAlgName: string): MerkleTree {
    const hashFn = this.createHashFunction(hashAlgName);
    const hashedLeaves = leaves.map((x) => hashFn(x));
    return new MerkleTree(hashedLeaves, hashFn);
  }

  public createHashFunction(hashAlgName: string): (data: any) => Buffer {
    return (data: any): Buffer => {
      return crypto.createHash(hashAlgName).update(data).digest();
    };
  }
}
