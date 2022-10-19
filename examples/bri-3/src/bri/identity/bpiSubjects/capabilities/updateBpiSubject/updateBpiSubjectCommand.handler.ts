import { Mapper } from '@automapper/core';
import { InjectMapper } from '@automapper/nestjs';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BpiSubjectAgent } from '../../agents/bpiSubjects.agent';
import { BpiSubjectStorageAgent } from '../../agents/bpiSubjectsStorage.agent';
import { BpiSubjectDto } from '../../api/dtos/response/bpiSubject.dto';
import { BpiSubject } from '../../models/bpiSubject';
import { UpdateBpiSubjectCommand } from './updateBpiSubject.command';

@CommandHandler(UpdateBpiSubjectCommand)
export class UpdateBpiSubjectCommandHandler
  implements ICommandHandler<UpdateBpiSubjectCommand>
{
  constructor(
    private agent: BpiSubjectAgent,
    private storageAgent: BpiSubjectStorageAgent,
    @InjectMapper() private autoMapper: Mapper 
  ) {}

  async execute(command: UpdateBpiSubjectCommand) {
    const bpiSubjectToUpdate: BpiSubject =
      await this.agent.fetchUpdateCandidateAndThrowIfUpdateValidationFails(
        command.id,
      );

    this.agent.updateBpiSubject(
      bpiSubjectToUpdate,
      command.name,
      command.description,
      command.publicKey,
    );

    const bpiSubject = await this.storageAgent.updateBpiSubject(bpiSubjectToUpdate);
    console.log(bpiSubject);
    const mappedToDto = this.autoMapper.map(bpiSubject, BpiSubject, BpiSubjectDto);
    console.log(mappedToDto);
    return mappedToDto;
  }
}
