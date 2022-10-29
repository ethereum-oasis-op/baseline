import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import { createMap, forMember, mapFrom, Mapper } from '@automapper/core';
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

        forMember(
          (d) => d.fromBpiSubjectAccountId,
          mapFrom((s) => s.fromBpiSubjectAccount.id),
        ),

        forMember(
          (d) => d.toBpiSubjectAccountId,
          mapFrom((s) => s.toBpiSubjectAccount.id),
        ),
      ),
        createMap(mapper, Transaction, Transaction);
    };
  }
}
