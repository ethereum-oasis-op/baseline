import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import { createMap, Mapper } from '@automapper/core';
import { Injectable } from '@nestjs/common';
import { BpiAccountDto } from './api/dtos/response/bpiAccount.dto';
import { BpiAccount } from './models/bpiAccount';

@Injectable()
export class AccountsProfile extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  override get profile() {
    return (mapper) => {
      createMap(mapper, BpiAccount, BpiAccountDto);
    };
  }
}
