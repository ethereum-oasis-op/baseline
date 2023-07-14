import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import { createMap, forMember, mapFrom, Mapper } from '@automapper/core';
import { Injectable } from '@nestjs/common';
import { MerkleTreeDto } from './api/dtos/response/merkleTree.dto';
import { BpiMerkleTree } from './models/bpiMerkleTree';
import MerkleTree from 'merkletreejs';
import { MerkleTreeService } from './services/merkleTree.service';

@Injectable()
export class MerkleProfile extends AutomapperProfile {
  constructor(
    @InjectMapper() mapper: Mapper,
    private readonly service: MerkleTreeService,
  ) {
    super(mapper);
  }

  override get profile() {
    return (mapper: Mapper) => {
      createMap(
        mapper,
        MerkleTreeDto,
        BpiMerkleTree,
        forMember(
          (destination) => destination.tree,
          mapFrom((source) =>
            MerkleTree.unmarshalTree(
              source.tree,
              this.service.createHashFunction(source.hashAlgName),
            ),
          ),
        ),
      );
      createMap(mapper, BpiMerkleTree, BpiMerkleTree);
    };
  }
}
