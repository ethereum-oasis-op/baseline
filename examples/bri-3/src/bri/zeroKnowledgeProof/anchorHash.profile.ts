import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import { createMap, Mapper } from '@automapper/core';
import { Injectable } from '@nestjs/common';
import { AnchorHash } from './models/anchorHash';
import { AnchorHashDto } from './api/dtos/response/anchorHash.dto';

@Injectable()
export class AnchorHashProfile extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  override get profile() {
    return (mapper) => {
      createMap(mapper, AnchorHash, AnchorHash);
      createMap(mapper, AnchorHash, AnchorHashDto);
    };
  }
}
