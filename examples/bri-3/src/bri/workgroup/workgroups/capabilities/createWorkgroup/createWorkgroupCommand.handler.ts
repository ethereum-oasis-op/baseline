import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { WorkgroupAgent } from '../../agents/workgroups.agent';
import { CreateWorkgroupCommand } from './createWorkgroup.command';

@CommandHandler(CreateWorkgroupCommand)
export class CreateWorkgroupCommandHandler implements ICommandHandler<CreateWorkgroupCommand>
{
  constructor(private agent: WorkgroupAgent, private repo: WorkgroupRepository) {}

  async execute(command: CreateWorkgroupCommand) {
    const {
      name,
      administrator,
      securityPolicy,
      privacyPolicy,
      participants,
      worksteps,
      workflows,
    } = command;

    this.agent.throwIfCreateWorkgroupInputInvalid(
      name,
      administrator,
      securityPolicy,
      privacyPolicy,
      participants,
      worksteps,
      workflows,
    );

    const newWorkgroupCandidate = this.agent.createNewWorkgroup(
      name,
      administrator,
      securityPolicy,
      privacyPolicy,
      participants,
      worksteps,
      workflows,
    );

    const newWorkgroup = await this.repo.createNewWorkgroup(newWorkgroupCandidate);

    return newWorkgroup.id;
  }
}
