import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import { createMap, Mapper } from '@automapper/core';
import { Injectable } from '@nestjs/common';
import { BpiSubject } from './models/bpiSubject';
import { BpiSubjectDto } from './api/dtos/response/bpiSubject.dto';
import { BpiSubjectRole } from './models/bpiSubjectRole';

@Injectable()
export class SubjectsProfile extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  override get profile() {
    return (mapper) => {
      createMap(mapper, BpiSubject, BpiSubjectDto);
      createMap(mapper, BpiSubject, BpiSubject);
      createMap(mapper, BpiSubjectRole, BpiSubjectRole);
    };
  }
}
