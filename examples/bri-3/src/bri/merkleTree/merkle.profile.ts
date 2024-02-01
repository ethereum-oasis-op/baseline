import { Mapper, createMap, forMember, mapFrom } from '@automapper/core';
import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import { Injectable } from '@nestjs/common';
import MerkleTree from 'merkletreejs';
import { MerkleTreeDto } from './api/dtos/response/merkleTree.dto';
import { BpiMerkleTree } from './models/bpiMerkleTree';

@Injectable()
export class MerkleProfile extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  override get profile() {
    return (mapper: Mapper) => {
      createMap(
        mapper,
        BpiMerkleTree,
        MerkleTreeDto,
        forMember(
          (destination) => destination.tree,
          mapFrom((source) => MerkleTree.marshalTree(source.tree)),
        ),
      );
    };
  }
}
