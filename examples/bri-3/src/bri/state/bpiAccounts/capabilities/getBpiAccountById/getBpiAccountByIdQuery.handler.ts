import { Mapper } from '@automapper/core';
import { InjectMapper } from '@automapper/nestjs';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { MerkleTreeStorageAgent } from '../../../../merkleTree/agents/merkleTreeStorage.agent';
import { BpiAccountStorageAgent } from '../../agents/bpiAccountsStorage.agent';
import { BpiAccountDto } from '../../api/dtos/response/bpiAccount.dto';
import { BpiAccount } from '../../models/bpiAccount';
import { GetBpiAccountByIdQuery } from './getBpiAccountById.query';
import { stat } from 'fs';

@QueryHandler(GetBpiAccountByIdQuery)
export class GetBpiAccountByIdQueryHandler
  implements IQueryHandler<GetBpiAccountByIdQuery>
{
  constructor(
    @InjectMapper() private readonly mapper: Mapper,
    private readonly storageAgent: BpiAccountStorageAgent,
    private readonly merkleTreeStorageAgent: MerkleTreeStorageAgent,
  ) {}

  async execute(query: GetBpiAccountByIdQuery) {
    const bpiAccount = await this.storageAgent.getAccountById(query.id);

    // TODO: #740 Remove this as soon as automapper is fixed
    // This should be handled as part of mapping the bpi account from the db
    // in the method getAccountById above
    const stateTree = await this.merkleTreeStorageAgent.getMerkleTreeById(
      bpiAccount.stateTreeId,
    );
    const historyTree = await this.merkleTreeStorageAgent.getMerkleTreeById(
      bpiAccount.historyTreeId,
    );

    bpiAccount.stateTree = stateTree!;
    bpiAccount.historyTree = historyTree!;

    return this.mapper.map(bpiAccount, BpiAccount, BpiAccountDto);
  }
}
