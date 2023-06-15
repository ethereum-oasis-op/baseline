import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { WorkstepAgent } from '../../agents/worksteps.agent';
import { WorkstepStorageAgent } from '../../agents/workstepsStorage.agent';
import { UpdateWorkstepCommand } from './updateWorkstep.command';
import { InjectMapper } from '@automapper/nestjs';
import { Mapper } from '@automapper/core';
import { Workstep } from '../../models/workstep';
import { WorkstepDto } from '../../api/dtos/response/workstep.dto';

@CommandHandler(UpdateWorkstepCommand)
export class UpdateWorkstepCommandHandler
  implements ICommandHandler<UpdateWorkstepCommand>
{
  constructor(
    @InjectMapper() private readonly mapper: Mapper,
    private agent: WorkstepAgent,
    private storageAgent: WorkstepStorageAgent,
  ) {}

  async execute(command: UpdateWorkstepCommand) {
    const workstepToUpdate =
      await this.agent.fetchUpdateCandidateAndThrowIfUpdateValidationFails(
        command.id,
      );

    this.agent.updateWorkstep(
      workstepToUpdate,
      command.name,
      command.version,
      command.status,
      command.workgroupId,
      command.securityPolicy,
      command.privacyPolicy,
    );

    const updatedWorkstep = await this.storageAgent.updateWorkstep(
      workstepToUpdate,
    );

    return this.mapper.map(updatedWorkstep, Workstep, WorkstepDto);
  }
}
