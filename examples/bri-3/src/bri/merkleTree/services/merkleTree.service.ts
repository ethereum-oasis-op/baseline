import { Injectable, NotFoundException } from '@nestjs/common';
import MerkleTree from 'merkletreejs';
import * as crypto from 'crypto';
import { HASH_ALG_NOT_SUPPORTED } from '../api/err.messages';

@Injectable()
export class MerkleTreeService {
  public formMerkleTree(leaves: string[], hashAlgName: string): MerkleTree {
    const hashFn = this.createHashFunction(hashAlgName);
    const hashedLeaves = leaves.map((x) => hashFn(x));
    return new MerkleTree(hashedLeaves, hashFn);
  }

  public createHashFunction(hashAlgName: string): (data: any) => Buffer {
    if (!crypto.getHashes().includes(hashAlgName)) {
      throw new NotFoundException(HASH_ALG_NOT_SUPPORTED(hashAlgName));
    }
    return (data: any): Buffer => {
      return crypto.createHash(hashAlgName).update(data).digest();
    };
  }

  public merkelizePayload(payload: JSON, hashAlgName: string): MerkleTree {
    const leaves: string[] = [];
    const recurse = (payload: JSON) => {
      for (const key in payload) {
        const value = payload[key];
        if (value != undefined) {
          if (value && typeof value === 'object') {
            recurse(value);
          } else {
            leaves.push(key);
            leaves.push(value.toString());
          }
        }
      }
    };

    recurse(payload);
    return this.formMerkleTree(leaves, hashAlgName);
  }
}
