import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import { createMap, Mapper } from '@automapper/core';
import { Injectable } from '@nestjs/common';
import { State } from './models/state';
import { StateDto } from './api/dtos/response/state.dto';

@Injectable()
export class StateProfile extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  override get profile() {
    return (mapper) => {
      createMap(mapper, State, State);
      createMap(mapper, State, StateDto);
    };
  }
}
