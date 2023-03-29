import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import { createMap, Mapper } from '@automapper/core';
import { Injectable } from '@nestjs/common';
import { MerkleTreeDto } from './api/dtos/response/merkleTree.dto';
import { BpiMerkleTree } from './models/bpiMerkleTree';

@Injectable()
export class MerkleProfile extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  override get profile() {
    return (mapper: Mapper) => {
      createMap(mapper, BpiMerkleTree, MerkleTreeDto);
      createMap(mapper, BpiMerkleTree, BpiMerkleTree);
    };
  }
}
