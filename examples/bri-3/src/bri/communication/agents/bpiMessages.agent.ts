import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { LoggingService } from '../../../shared/logging/logging.service';
import { BpiSubjectStorageAgent } from '../../identity/bpiSubjects/agents/bpiSubjectsStorage.agent';
import { BpiSubject } from '../../identity/bpiSubjects/models/bpiSubject';
import {
  BPI_MESSAGE_ALREADY_EXISTS,
  NOT_FOUND_ERR_MESSAGE,
} from '../api/err.messages';
import { BpiMessage } from '../models/bpiMessage';
import { BpiMessageType } from '../models/bpiMessageType.enum';
import { BpiMessageStorageAgent } from './bpiMessagesStorage.agent';

@Injectable()
export class BpiMessageAgent {
  constructor(
    private bpiMessageStorageAgent: BpiMessageStorageAgent,
    private bpiSubjectStorageAgent: BpiSubjectStorageAgent,
    private readonly logger: LoggingService,
  ) {}

  public async validateNewBpiMessageAgainstExistingBpiEntitiesWithThrow(
    messageId: string,
    fromBpiSubjectId: string,
    toBpiSubjectId: string,
  ): Promise<[BpiSubject, BpiSubject]> {
    const existingBpiMessage =
      await this.bpiMessageStorageAgent.getBpiMessageById(messageId);

    if (existingBpiMessage) {
      throw new BadRequestException(BPI_MESSAGE_ALREADY_EXISTS(messageId));
    }

    const fromBpiSubject = await this.bpiSubjectStorageAgent.getBpiSubjectById(
      fromBpiSubjectId,
    );

    if (!fromBpiSubject) {
      throw new NotFoundException(NOT_FOUND_ERR_MESSAGE);
    }

    const toBpiSubject = await this.bpiSubjectStorageAgent.getBpiSubjectById(
      toBpiSubjectId,
    );

    if (!toBpiSubject) {
      throw new NotFoundException(NOT_FOUND_ERR_MESSAGE);
    }

    return [fromBpiSubject, toBpiSubject];
  }

  public async validateNewBpiMessageAgainstExistingBpiEntities(
    messageId: string,
    fromBpiSubjectId: string,
    toBpiSubjectId: string,
  ): Promise<[boolean, BpiSubject, BpiSubject]> {
    const existingBpiMessage =
      await this.bpiMessageStorageAgent.getBpiMessageById(messageId);

    if (existingBpiMessage) {
      this.logger.logError(
        `BpiMessageAgent: BPI Message with id: ${existingBpiMessage.id} already exists.`,
      );

      return [false, null, null];
    }

    const fromBpiSubject = await this.bpiSubjectStorageAgent.getBpiSubjectById(
      fromBpiSubjectId,
    );

    if (!fromBpiSubject) {
      this.logger.logError(`BpiMessageAgent: From Bpi Subjects do not exist.`);

      return [false, null, null];
    }

    const toBpiSubject = await this.bpiSubjectStorageAgent.getBpiSubjectById(
      toBpiSubjectId,
    );

    if (!fromBpiSubject) {
      this.logger.logError(`BpiMessageAgent: To Bpi Subject do not exist.`);

      return [false, null, null];
    }

    return [true, fromBpiSubject, toBpiSubject];
  }

  public createNewBpiMessage(
    id: string,
    from: BpiSubject,
    to: BpiSubject,
    content: string,
    signature: string,
    type: BpiMessageType,
  ): BpiMessage {
    return new BpiMessage(id, from, to, content, signature, type);
  }

  public async fetchUpdateCandidateAndThrowIfUpdateValidationFails(
    id: string,
  ): Promise<BpiMessage> {
    const bpiMessageToUpdate: BpiMessage =
      await this.bpiMessageStorageAgent.getBpiMessageById(id);

    if (!bpiMessageToUpdate) {
      throw new NotFoundException(NOT_FOUND_ERR_MESSAGE);
    }

    return bpiMessageToUpdate;
  }

  public updateBpiMessage(
    bpiMessageToUpdate: BpiMessage,
    content: string,
    signature: string,
  ) {
    bpiMessageToUpdate.updateContent(content);
    bpiMessageToUpdate.updateSignature(signature);
  }

  public async fetchDeleteCandidateAndThrowIfDeleteValidationFails(
    id: string,
  ): Promise<BpiMessage> {
    const bpiMessageToDelete =
      await this.bpiMessageStorageAgent.getBpiMessageById(id);

    if (!bpiMessageToDelete) {
      throw new NotFoundException(NOT_FOUND_ERR_MESSAGE);
    }

    return bpiMessageToDelete;
  }
}
