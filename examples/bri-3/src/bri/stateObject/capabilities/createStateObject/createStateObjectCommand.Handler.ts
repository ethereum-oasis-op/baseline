import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateStateObjectCommand } from './createStateObject.command';

@CommandHandler(CreateStateObjectCommand)
export class CreateStateObjectCommandHandler
  implements ICommandHandler<CreateStateObjectCommand>
{
  constructor(
    private readonly agent: StateObjectAgent,
    private readonly storageAgent: StateObjectStorageAgent,
  ) {}

  async execute(command: CreateStateObjectCommand) {
    const newStateObjectCandidate = this.agent.createNewStateObject(
      command.id,
      command.proof,
      command.document,
      command.proverSystem,
      command.witness,
    );

    const newStateObject = await this.storageAgent.createNewStateObject(
      newStateObjectCandidate,
    );

    return newStateObject.id;
  }
}
