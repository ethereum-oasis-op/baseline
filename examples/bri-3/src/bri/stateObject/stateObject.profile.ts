import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import { createMap, Mapper } from '@automapper/core';
import { Injectable } from '@nestjs/common';
import { StateObject } from './models/stateObject';

@Injectable()
export class StateObjectProfile extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  override get profile() {
    return (mapper) => {
      createMap(mapper, StateObject, StateObejctDto);
      createMap(mapper, StateObject, StateObject);
    };
  }
}
