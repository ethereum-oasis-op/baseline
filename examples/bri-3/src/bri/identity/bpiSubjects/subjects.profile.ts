import { Mapper, createMap } from '@automapper/core';
import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import { Injectable } from '@nestjs/common';
import { BpiSubjectDto } from './api/dtos/response/bpiSubject.dto';
import { BpiSubject } from './models/bpiSubject';
import { BpiSubjectRole } from './models/bpiSubjectRole';

@Injectable()
export class SubjectsProfile extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  override get profile() {
    
    return (mapper) => {     
      createMap(mapper, BpiSubject, BpiSubjectDto);
      createMap(mapper, BpiSubjectRole, BpiSubjectRole);
    };
  }
}
