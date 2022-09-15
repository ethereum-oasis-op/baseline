import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { WorkstepAgent } from '../../agents/worksteps.agent';
import { WorkstepRepository } from '../../persistence/worksteps.repository';
import { CreateWorkstepCommand } from './createWorkstep.command';

@CommandHandler(CreateWorkstepCommand)
export class CreateWorkstepCommandHandler implements ICommandHandler<CreateWorkstepCommand>
{
  constructor(private agent: WorkstepAgent, private repo: WorkstepRepository) {}

  async execute(command: CreateWorkstepCommand) {
    this.agent.throwIfCreateWorkstepInputInvalid( command.name, command.version, command.status, command.workgroupId);

    const newWorkstepCandidate = this.agent.createNewWorkstep( command.name, command.version, command.status, command.workgroupId, command.securityPolicy, command.privacyPolicy);

    const newWorkstep = this.repo.createNewWorkstep(newWorkstepCandidate);

    return (await newWorkstep).id;
  }
}
