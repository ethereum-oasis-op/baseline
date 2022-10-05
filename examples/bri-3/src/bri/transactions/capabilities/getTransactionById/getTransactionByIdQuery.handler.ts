import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { TransactionDto } from '../../api/dtos/response/transaction.dto';
import { TransactionStorageAgent } from '../../agents/transactionStorage.agent';
import { GetTransactionByIdQuery } from './getTransactionById.query';

@QueryHandler(GetTransactionByIdQuery)
export class GetBpiSubjectByIdQueryHandler
  implements IQueryHandler<GetTransactionByIdQuery>
{
  constructor(private readonly storageAgent: TransactionStorageAgent) {}

  async execute(query: GetTransactionByIdQuery) {
    const transaction = await this.storageAgent.getTransactionById(query.id);

    // TODO: null check

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
