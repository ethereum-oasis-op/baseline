import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import { createMap, Mapper } from '@automapper/core';
import { Injectable } from '@nestjs/common';
import { CCSMAnchorHash } from './models/ccsmAnchorHash';
import { CCSMAnchorHashDto } from './api/dtos/response/ccsmAnchorHash.dto';

@Injectable()
export class CCSMAnchorHashProfile extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  override get profile() {
    return (mapper) => {
      createMap(mapper, CCSMAnchorHash, CCSMAnchorHashDto);
      createMap(mapper, CCSMAnchorHash, CCSMAnchorHash);
    };
  }
}
