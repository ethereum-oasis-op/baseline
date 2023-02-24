import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { StateObject } from '../../models/stateObject';
import { UpdateStateObjectCommand } from './updateStateObject.command';

@CommandHandler(UpdateStateObjectCommand)
export class UpdateStateObjectCommandHandler
  implements ICommandHandler<UpdateStateObjectCommand>
{
  constructor(
    private agent: StateObjectAgent,
    private storageAgent: StateObjectStorageAgent,
  ) {}

  async execute(command: UpdateStateObjectCommand) {
    const stateObjectToUpdate: StateObject =
      await this.agent.fetchUpdateCandidateAndThrowIfUpdateValidationFails(
        command.id,
      );

    this.agent.updateStateObject(
      stateObjectToUpdate,
      command.proof,
      command.document,
      command.proverSystem,
      command.witness,
    );

    return await this.storageAgent.updateStateObject(stateObjectToUpdate);
  }
}
