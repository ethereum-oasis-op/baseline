import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { TransactionStorageAgent } from '../../agents/transactionStorage.agent';
import { CreateTransactionCommand } from './createTransaction.command';

@CommandHandler(CreateTransactionCommand)
export class CreateTransactionCommandHandler
  implements ICommandHandler<CreateTransactionCommand>
{
  constructor(
    // private agent: BpiSubjectAgent,
    private repo: TransactionStorageAgent,
  ) {}

  async execute(command: CreateTransactionCommand) {
    // this.agent.throwIfCreateBpiSubjectInputInvalid(command.name);

    // const newBpiSubjectCandidate = this.agent.createNewExternalBpiSubject(
    //   command.name,
    //   command.description,
    //   command.publicKey,
    // );

    // const newBpiSubject = await this.repo.createNewBpiSubject(
    //   newBpiSubjectCandidate,
    // );

    return null;
  }
}
