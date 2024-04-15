import { PrismaMapper as Mapper } from '../../../../../shared/prisma/prisma.mapper';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BpiSubjectAgent } from '../../agents/bpiSubjects.agent';
import { BpiSubjectStorageAgent } from '../../agents/bpiSubjectsStorage.agent';
import { BpiSubject } from '../../models/bpiSubject';
import { UpdateBpiSubjectCommand } from './updateBpiSubject.command';
import { PublicKey, PublicKeyType } from '../../models/publicKey';

@CommandHandler(UpdateBpiSubjectCommand)
export class UpdateBpiSubjectCommandHandler
  implements ICommandHandler<UpdateBpiSubjectCommand>
{
  constructor(
    private readonly mapper: Mapper,
    private agent: BpiSubjectAgent,
    private storageAgent: BpiSubjectStorageAgent,
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
      command.publicKeys,
    );

    const bpiSubject = await this.storageAgent.updateBpiSubject(
      bpiSubjectToUpdate,
    );

    return this.mapper.map(bpiSubject, BpiSubject);
  }
}
