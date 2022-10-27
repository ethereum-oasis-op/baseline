import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import {
  createMap,
  forMember,
  ignore,
  mapFrom,
  Mapper,
} from '@automapper/core';
import { Injectable } from '@nestjs/common';
import { Transaction } from './models/transaction';
import { TransactionDto } from './api/dtos/response/transaction.dto';

@Injectable()
export class TransactionsProfile extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  override get profile() {
    return (mapper) => {
      createMap(
        mapper,
        Transaction,
        TransactionDto,

        //remove this once the good value is available
        forMember(
          (d) => d.from,
          mapFrom((s) => ''),
        ),

        //remove this once the good value is available
        forMember(
          (d) => d.to,
          mapFrom((s) => ''),
        ),
      );

      createMap(
        mapper,
        Transaction,
        Transaction,

        //remove this once the good value is available
        // forMember(
        //   (d) => d.from,
        //   fromValue(null),
        // ),

        // //remove this once the good value is available
        // forMember(
        //   (d) => d.to,
        //   fromValue(null),
        // ),

        forMember((d) => d.updatePayload, ignore()),
        forMember((d) => d.from, ignore()),
        forMember((d) => d.to, ignore()),
      );
    };
  }
}