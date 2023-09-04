import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import { createMap, Mapper } from '@automapper/core';
import { Injectable } from '@nestjs/common';
import { StateLeafValues } from './models/stateLeafValues';
import { StateContent } from './models/stateContent';

@Injectable()
export class StateProfile extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  override get profile() {
    return (mapper: Mapper) => {
      createMap(mapper, StateLeafValues, StateLeafValues);
    };
  }
}
