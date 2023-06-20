import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BpiMessageAgent } from '../../agents/bpiMessages.agent';
import { BpiMessageStorageAgent } from '../../agents/bpiMessagesStorage.agent';
import { BpiMessage } from '../../models/bpiMessage';
import { UpdateBpiMessageCommand } from './updateBpiMessage.command';
import { BpiMessageDto } from '../../api/dtos/response/bpiMessage.dto';
import { InjectMapper } from '@automapper/nestjs';
import { Mapper } from '@automapper/core';

@CommandHandler(UpdateBpiMessageCommand)
export class UpdateBpiMessageCommandHandler
  implements ICommandHandler<UpdateBpiMessageCommand>
{
  constructor(
    @InjectMapper() private readonly mapper: Mapper,
    private agent: BpiMessageAgent,
    private storageAgent: BpiMessageStorageAgent,
  ) {}

  async execute(command: UpdateBpiMessageCommand) {
    const bpiMessageToUpdate: BpiMessage =
      await this.agent.fetchUpdateCandidateAndThrowIfUpdateValidationFails(
        command.id,
      );

    this.agent.updateBpiMessage(
      bpiMessageToUpdate,
      command.content,
      command.signature,
    );

    const updatedBpiMessage = await this.storageAgent.updateBpiMessage(
      bpiMessageToUpdate,
    );

    return this.mapper.map(updatedBpiMessage, BpiMessage, BpiMessageDto);
  }
}
