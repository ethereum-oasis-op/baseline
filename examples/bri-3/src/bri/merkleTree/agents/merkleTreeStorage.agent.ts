import { Injectable } from '@nestjs/common';
import { InjectMapper } from '@automapper/nestjs';
import { Mapper } from '@automapper/core';
import { PrismaService } from '../../../../prisma/prisma.service';
import MerkleTree from 'merkletreejs';
import { BpiMerkleTree } from '../models/bpiMerkleTree';

@Injectable()
export class MerkleTreeStorageAgent extends PrismaService {
  constructor(@InjectMapper() private mapper: Mapper) {
    super();
  }

  async getMerkleTreeById(id: string): Promise<BpiMerkleTree> {
    const merkleTreeModel = await this.bpiMerkleTree.findUnique({
      where: { id },
    });

    if (!merkleTreeModel) {
      return null;
    }

    const merkleTree = new BpiMerkleTree(
      merkleTreeModel.id,
      MerkleTree.unmarshalTree(merkleTreeModel.merkleTree),
    );

    return this.mapper.map(merkleTree, BpiMerkleTree, BpiMerkleTree);
  }

  async storeNewMerkleTree(merkleTree: BpiMerkleTree): Promise<BpiMerkleTree> {
    await this.bpiMerkleTree.create({
      data: {
        id: merkleTree.id,
        merkleTree: MerkleTree.marshalTree(merkleTree.merkleTree),
      },
    });

    return this.mapper.map(merkleTree, BpiMerkleTree, BpiMerkleTree);
  }

  async storeUpdatedMerkleTree(
    merkleTree: BpiMerkleTree,
  ): Promise<BpiMerkleTree> {
    await this.bpiMerkleTree.update({
      where: { id: merkleTree.id },
      data: {
        id: merkleTree.id,
        merkleTree: MerkleTree.marshalTree(merkleTree.merkleTree),
      },
    });

    return this.mapper.map(merkleTree, BpiMerkleTree, BpiMerkleTree);
  }

  async deleteMerkleTree(merkleTree: BpiMerkleTree): Promise<void> {
    await this.bpiMerkleTree.delete({
      where: { id: merkleTree.id },
    });
  }
}
