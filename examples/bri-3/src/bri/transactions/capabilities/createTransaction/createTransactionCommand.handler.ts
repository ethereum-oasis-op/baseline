import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BpiSubjectAccountAgent } from '../../../identity/bpiSubjectAccounts/agents/bpiSubjectAccounts.agent';
import { TransactionAgent } from '../../agents/transactions.agent';
import { TransactionStorageAgent } from '../../agents/transactionStorage.agent';
import { CreateTransactionCommand } from './createTransaction.command';

@CommandHandler(CreateTransactionCommand)
export class CreateTransactionCommandHandler
  implements ICommandHandler<CreateTransactionCommand>
{
  constructor(
    private agent: TransactionAgent,
    private storageAgent: TransactionStorageAgent,
    private subjectAccountAgent: BpiSubjectAccountAgent,
  ) {}

  async execute(command: CreateTransactionCommand) {
    this.agent.throwIfCreateTransactionInputInvalid();
    const subjectAccounts =
      await this.subjectAccountAgent.getBpiSubjectAccountsAndThrowIfNotExist([
        command.fromSubjectAccountId,
        command.toSubjectAccountId,
      ]);

    const newTransactionCandidate = this.agent.createNewTransaction(
      command.id,
      command.nonce,
      command.workflowInstanceId,
      command.workstepInstanceId,
      subjectAccounts[0],
      subjectAccounts[1],
      command.payload,
      command.signature,
    );

    const newTransaction = await this.storageAgent.createNewTransaction(
      newTransactionCandidate,
    );

    return newTransaction.id;
  }
}
