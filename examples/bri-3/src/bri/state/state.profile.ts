import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import { createMap, Mapper } from '@automapper/core';
import { Injectable } from '@nestjs/common';
import { StateTreeLeafValueContent } from './models/stateTreeLeafValueContent';
import { StateTreeLeafValueContentDto } from './api/dtos/response/stateTreeLeafValueContent.dto';

@Injectable()
export class StateProfile extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  override get profile() {
    return (mapper: Mapper) => {
      createMap(
        mapper,
        StateTreeLeafValueContent,
        StateTreeLeafValueContentDto,
      );
    };
  }
}
