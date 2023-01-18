import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BpiSubjectStorageAgent } from '../../../../identity/bpiSubjects/agents/bpiSubjectsStorage.agent';
import { WorkgroupAgent } from '../../agents/workgroups.agent';
import { WorkgroupStorageAgent } from '../../agents/workgroupStorage.agent';
import { CreateWorkgroupCommand } from './createWorkgroup.command';

@CommandHandler(CreateWorkgroupCommand)
export class CreateWorkgroupCommandHandler
  implements ICommandHandler<CreateWorkgroupCommand>
{
  constructor(
    private agent: WorkgroupAgent,
    private workgroupStorageAgent: WorkgroupStorageAgent,
    private bpiSubjectStorageAgent: BpiSubjectStorageAgent,
  ) {}

  async execute(command: CreateWorkgroupCommand) {
    const workgroupCreator =
      await this.bpiSubjectStorageAgent.getBpiSubjectByPublicKey(
        command.publicKey,
      );

    const newWorkgroupCandidate = this.agent.createNewWorkgroup(
      command.name,
      [workgroupCreator],
      command.securityPolicy,
      command.privacyPolicy,
      [workgroupCreator],
      [],
      [],
    );

    const newWorkgroup = await this.workgroupStorageAgent.createNewWorkgroup(
      newWorkgroupCandidate,
    );

    return newWorkgroup.id;
  }
}
