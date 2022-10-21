import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import {
  createMap,
  forMember,
  mapFrom,
  Mapper,
} from '@automapper/core';
import { Injectable } from '@nestjs/common';
import { BpiSubjectAccountDto } from './api/dtos/response/bpiSubjectAccount.dto';
import { BpiSubjectAccount } from './models/bpiSubjectAccount';

@Injectable()
export class SubjectAccountsProfile extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  override get profile() {
    return (mapper) => {
      
      createMap(mapper, BpiSubjectAccount, BpiSubjectAccountDto)
      createMap(mapper, BpiSubjectAccount, BpiSubjectAccount)
    };
  }
}
