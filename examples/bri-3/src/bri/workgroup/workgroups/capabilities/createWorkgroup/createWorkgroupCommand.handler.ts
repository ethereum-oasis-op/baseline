import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { WorkgroupAgent } from '../../agents/workgroups.agent';
import { WorkgroupStorageAgent } from '../../agents/workgroupStorage.agent';
import { CreateWorkgroupCommand } from './createWorkgroup.command';
import { decodeJWT } from 'did-jwt';

@CommandHandler(CreateWorkgroupCommand)
export class CreateWorkgroupCommandHandler
  implements ICommandHandler<CreateWorkgroupCommand>
{
  constructor(
    private agent: WorkgroupAgent,
    private storageAgent: WorkgroupStorageAgent,
  ) {}

  async execute(command: CreateWorkgroupCommand) {
    const token = command.accessToken.split(' ')[1];
    const publicKey = decodeJWT(token).payload.sub.split(':')[3];

    const workgroupCreator =
      await this.agent.fetchBpiSubjectByPublicKeyAndThrowIfNoneExist(publicKey);

    const newWorkgroupCandidate = this.agent.createNewWorkgroup(
      command.name,
      [workgroupCreator],
      command.securityPolicy,
      command.privacyPolicy,
      [workgroupCreator],
      [],
      [],
    );

    const newWorkgroup = await this.storageAgent.createNewWorkgroup(
      newWorkgroupCandidate,
    );

    return newWorkgroup.id;
  }
}
