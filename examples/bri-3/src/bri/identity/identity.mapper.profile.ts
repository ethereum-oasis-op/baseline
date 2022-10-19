import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import { createMap, Mapper } from '@automapper/core';
import { Injectable } from '@nestjs/common';
import { BpiSubject } from './bpiSubjects/models/bpiSubject';
import { BpiSubjectDto } from './bpiSubjects/api/dtos/response/bpiSubject.dto';

@Injectable()
export class IdentityProfile extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  override get profile() {
    return (mapper) => {
      createMap(mapper, BpiSubject, BpiSubjectDto);
    };
  }

  get mapperInstance() {
    return this.mapper
  }
}
