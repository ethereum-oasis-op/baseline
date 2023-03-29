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

  async createNewMerkleTree(merkleTree: BpiMerkleTree): Promise<BpiMerkleTree> {
    const treeIn = {
      id: merkleTree.id,
      merkleTree: MerkleTree.marshalTree(merkleTree.merkleTree),
    };
    const newMerkleTreeModel = await this.bpiMerkleTree.create({
      data: {
        ...treeIn,
      },
    });

    const treeOut = {
      id: newMerkleTreeModel.id,
      merkleTree: MerkleTree.unmarshalTree(merkleTree.merkleTree),
    };
    return this.mapper.map(treeOut, BpiMerkleTree, BpiMerkleTree);
  }

  async updateMerkleTree(merkleTree: BpiMerkleTree): Promise<BpiMerkleTree> {
    const treeIn = {
      id: merkleTree.id,
      merkleTree: MerkleTree.marshalTree(merkleTree.merkleTree),
    };
    const updatedMerkleTreeModel = await this.bpiMerkleTree.update({
      where: { id: merkleTree.id },
      data: {
        ...treeIn,
      },
    });

    const treeOut = {
      id: updatedMerkleTreeModel.id,
      merkleTree: MerkleTree.unmarshalTree(merkleTree.merkleTree),
    };
    return this.mapper.map(treeOut, BpiMerkleTree, BpiMerkleTree);
  }

  async deleteMerkleTree(merkleTree: BpiMerkleTree): Promise<void> {
    await this.bpiMerkleTree.delete({
      where: { id: merkleTree.id },
    });
  }
}
