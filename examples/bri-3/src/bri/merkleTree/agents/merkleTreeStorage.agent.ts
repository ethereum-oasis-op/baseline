import { Injectable } from '@nestjs/common';
import { InjectMapper } from '@automapper/nestjs';
import { Mapper } from '@automapper/core';
import MerkleTree from 'merkletreejs';
import { BpiMerkleTree } from '../models/bpiMerkleTree';
import { MerkleTreeDto } from '../api/dtos/response/merkleTree.dto';
import { PrismaService } from '../../../shared/prisma/prisma.service';

@Injectable()
export class MerkleTreeStorageAgent {
  constructor(
    @InjectMapper() private mapper: Mapper,
    private readonly prisma: PrismaService,
  ) {}

  async getMerkleTreeById(id: string): Promise<BpiMerkleTree | undefined> {
    const merkleTreeModel = await this.prisma.bpiMerkleTree.findUnique({
      where: { id },
    });

    if (!merkleTreeModel) {
      return undefined;
    }

    return this.mapper.map(merkleTreeModel, MerkleTreeDto, BpiMerkleTree);
  }

  async storeNewMerkleTree(merkleTree: BpiMerkleTree): Promise<BpiMerkleTree> {
    const storedMerkleTree = await this.prisma.bpiMerkleTree.create({
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
    const updatedMerkleTree = await this.prisma.bpiMerkleTree.update({
      where: { id: merkleTree.id },
      data: {
        tree: MerkleTree.marshalTree(merkleTree.tree),
      },
    });

    return this.mapper.map(updatedMerkleTree, MerkleTreeDto, BpiMerkleTree);
  }

  async deleteMerkleTree(merkleTree: BpiMerkleTree): Promise<BpiMerkleTree> {
    await this.prisma.bpiMerkleTree.delete({
      where: { id: merkleTree.id },
    });

    // TODO: #740 Mil5 - Mapping from a prisma client type to a domain object is not working.
    // We need to address this by either introducing a helper model (like the MerkleTreeDto above)
    // or experimenting with automapper pojos strategy.
    return this.mapper.map(merkleTree, BpiMerkleTree, BpiMerkleTree);
  }
}
