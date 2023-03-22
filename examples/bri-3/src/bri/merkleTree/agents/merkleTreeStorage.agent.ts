import { Injectable } from '@nestjs/common';
import { InjectMapper } from '@automapper/nestjs';
import { Mapper } from '@automapper/core';
import { PrismaService } from '../../../../prisma/prisma.service';
import { BpiMerkleTree } from '../models/merkleTree';

@Injectable()
export class MerkleTreeStorageAgent extends PrismaService {
  constructor(@InjectMapper() private mapper: Mapper) {
    super();
  }

  async getMerkleTreeById(id: string): Promise<BpiMerkleTree> {
    const merkleTreeModel = await this.merkleTree.findUnique({
      where: { id },
    });

    if (!merkleTreeModel) {
      return null;
    }

    return this.mapper.map(merkleTreeModel, BpiMerkleTree, BpiMerkleTree);
  }

  async createNewMerkleTree(merkleTree: BpiMerkleTree): Promise<BpiMerkleTree> {
    const newMerkleTreeModel = await this.merkleTree.create({
      data: {
        ...merkleTree,
      },
    });

    return this.mapper.map(newMerkleTreeModel, BpiMerkleTree, BpiMerkleTree);
  }

  async updateMerkleTree(merkleTree: BpiMerkleTree): Promise<BpiMerkleTree> {
    const updatedMerkleTreeModel = await this.merkleTree.update({
      where: { id: merkleTree.id },
      data: {
        ...merkleTree,
      },
    });
    return this.mapper.map(
      updatedMerkleTreeModel,
      BpiMerkleTree,
      BpiMerkleTree,
    );
  }

  async deleteMerkleTree(merkleTree: BpiMerkleTree): Promise<void> {
    await this.merkleTree.delete({
      where: { id: merkleTree.id },
    });
  }
}
