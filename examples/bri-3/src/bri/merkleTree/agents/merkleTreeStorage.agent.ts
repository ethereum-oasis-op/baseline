import { Injectable } from '@nestjs/common';
import MerkleTree from 'merkletreejs';
import { PrismaMapper } from '../../../shared/prisma/prisma.mapper';
import { PrismaService } from '../../../shared/prisma/prisma.service';
import { BpiMerkleTree } from '../models/bpiMerkleTree';

@Injectable()
export class MerkleTreeStorageAgent {
  constructor(
    private readonly mapper: PrismaMapper,
    private readonly prisma: PrismaService,
  ) {}

  async getMerkleTreeById(id: string): Promise<BpiMerkleTree | undefined> {
    const merkleTreeModel = await this.prisma.bpiMerkleTree.findUnique({
      where: { id },
    });

    if (!merkleTreeModel) {
      return undefined;
    }

    return this.mapper.mapBpiMerkleTreePrismaModelToDomainObject(
      merkleTreeModel,
    );
  }

  async storeNewMerkleTree(merkleTree: BpiMerkleTree): Promise<BpiMerkleTree> {
    const storedMerkleTree = await this.prisma.bpiMerkleTree.create({
      data: {
        id: merkleTree.id,
        hashAlgName: merkleTree.hashAlgName,
        tree: MerkleTree.marshalTree(merkleTree.tree),
      },
    });

    return this.mapper.mapBpiMerkleTreePrismaModelToDomainObject(
      storedMerkleTree,
    );
  }

  async storeUpdatedMerkleTree(
    merkleTree: BpiMerkleTree,
  ): Promise<BpiMerkleTree> {
    const updatedMerkleTree = await this.prisma.bpiMerkleTree.update({
      where: { id: merkleTree.id },
      data: {
        tree: MerkleTree.marshalTree(merkleTree.tree),
      },
    });

    return this.mapper.mapBpiMerkleTreePrismaModelToDomainObject(
      updatedMerkleTree,
    );
  }

  async deleteMerkleTree(merkleTree: BpiMerkleTree): Promise<void> {
    await this.prisma.bpiMerkleTree.delete({
      where: { id: merkleTree.id },
    });
  }
}
