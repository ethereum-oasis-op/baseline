import { Injectable } from '@nestjs/common';
import { BpiMerkleTree as BpiMerkleTreePrismaModel } from '@prisma/client';
import { BpiMerkleTree } from '../../bri/merkleTree/models/bpiMerkleTree';
import { MerkleTreeService } from '../../bri/merkleTree/services/merkleTree.service';
import MerkleTree from 'merkletreejs';

// We do mapping from prisma models to domain objects using simple Object.assign in a generic Map method below,
// since automapper is not happy working with types, which is how Prisma generates database entities.
// For these mappings to work, the convention is that the domain objects have the same properties as the
// prisma models. In case there is a need to do something custom during mapping, it can be implemented
// in a separate method below.

interface IConstructor<T> {
  new (...args: any[]): T;
}

@Injectable()
export class PrismaMapper {
  constructor(private readonly merkleTreeService: MerkleTreeService) {}

  public map<T extends object>(source: any, targetType: IConstructor<T>): T {
    const target = this.activator(targetType);

    Object.assign(target, source);

    return target;
  }

  public mapBpiMerkleTreePrismaModelToDomainObject(
    source: BpiMerkleTreePrismaModel,
  ): BpiMerkleTree {
    const target = this.activator(BpiMerkleTree);

    Object.assign(target, source);

    target.tree = MerkleTree.unmarshalTree(
      source.tree,
      this.merkleTreeService.createHashFunction(source.hashAlgName),
    );

    return target;
  }

  private activator<T>(type: IConstructor<T>): T {
    return new type();
  }
}
