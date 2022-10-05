import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { TransactionDto } from '../../api/dtos/response/transaction.dto';
import { TransactionStorageAgent } from '../../agents/transactionStorage.agent';
import { GetTransactionByIdQuery } from './getTransactionById.query';
import { NotFoundException } from '@nestjs/common';
import { NOT_FOUND_ERR_MESSAGE } from '../../api/err.messages';

@QueryHandler(GetTransactionByIdQuery)
export class GetBpiSubjectByIdQueryHandler
  implements IQueryHandler<GetTransactionByIdQuery>
{
  constructor(private readonly storageAgent: TransactionStorageAgent) {}

  async execute(query: GetTransactionByIdQuery) {
    const transaction = await this.storageAgent.getTransactionById(query.id);

    if (!transaction) {
      throw new NotFoundException(NOT_FOUND_ERR_MESSAGE);
    }

    return {
      id: transaction.id,
      nonce: transaction.nonce,
      workflowInstanceId: transaction.workflowInstanceId,
      workstepInstanceId: transaction.workstepInstanceId,
      from: '', // TODO: transaction.from once BpiAccount in the prisma schema,
      to: '', // TODO: transaction.from once BpiAccount in the prisma schema,
      payload: transaction.payload,
      signature: transaction.signature,
      status: transaction.status,
    } as TransactionDto;
  }
}
