import { Injectable } from '@nestjs/common';
import { InjectMapper } from '@automapper/nestjs';
import { Mapper } from '@automapper/core';
import { PrismaService } from '../../../../prisma/prisma.service';
import MerkleTree from 'merkletreejs';
import { BpiMerkleTree } from '../models/bpiMerkleTree';
import { MerkleTreeDto } from '../api/dtos/response/merkleTree.dto';

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

    return this.mapper.map(merkleTreeModel, MerkleTreeDto, BpiMerkleTree);
  }

  async storeNewMerkleTree(merkleTree: BpiMerkleTree): Promise<BpiMerkleTree> {
    const storedMerkleTree = await this.bpiMerkleTree.create({
      data: {
        id: merkleTree.id,
        hashAlgName: merkleTree.hashAlgName,
        tree: MerkleTree.marshalTree(merkleTree.tree),
      },
    });

    return this.mapper.map(storedMerkleTree, MerkleTreeDto, BpiMerkleTree);
  }

  async storeUpdatedMerkleTree(
    merkleTree: BpiMerkleTree,
  ): Promise<BpiMerkleTree> {
    const updatedMerkleTree = await this.bpiMerkleTree.update({
      where: { id: merkleTree.id },
      data: {
        id: merkleTree.id,
        tree: MerkleTree.marshalTree(merkleTree.tree),
      },
    });

    return this.mapper.map(updatedMerkleTree, MerkleTreeDto, BpiMerkleTree);
  }

  async deleteMerkleTree(merkleTree: BpiMerkleTree): Promise<BpiMerkleTree> {
    await this.bpiMerkleTree.delete({
      where: { id: merkleTree.id },
    });

    return this.mapper.map(merkleTree, BpiMerkleTree, BpiMerkleTree);
  }
}
