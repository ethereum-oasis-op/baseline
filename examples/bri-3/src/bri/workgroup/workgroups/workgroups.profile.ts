import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import { createMap, Mapper } from '@automapper/core';
import { Injectable } from '@nestjs/common';
import { Workgroup } from './models/workgroup';
import { WorkgroupDto } from './api/dtos/response/workgroup.dto';

@Injectable()
export class WorkgroupProfile extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  override get profile() {
    return (mapper) => {
      createMap(mapper, Workgroup, WorkgroupDto);
    };
  }
}
