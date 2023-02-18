import { Injectable, NotFoundException } from '@nestjs/common';
import { BpiMessage } from '../models/bpiMessage';
import { BpiMessageType } from '../models/bpiMessageType.enum';
import { NOT_FOUND_ERR_MESSAGE } from '../api/err.messages';
import { BpiMessageStorageAgent } from './bpiMessagesStorage.agent';
import { BpiSubject } from '../../identity/bpiSubjects/models/bpiSubject';
import { BpiSubjectStorageAgent } from '../../identity/bpiSubjects/agents/bpiSubjectsStorage.agent';

@Injectable()
export class BpiMessageAgent {
  constructor(
    private bpiMessageStorageAgent: BpiMessageStorageAgent,
    private bpiSubjectStorageAgent: BpiSubjectStorageAgent,
  ) {}

  public async getFromAndToSubjectsAndThrowIfNotExist(
    fromBpiSubjectId: string,
    toBpiSubjectId: string,
  ): Promise<[BpiSubject, BpiSubject]> {
    const fromBpiSubject = await this.bpiSubjectStorageAgent.getBpiSubjectById(
      fromBpiSubjectId,
    );

    if (!fromBpiSubject) {
      throw new NotFoundException(NOT_FOUND_ERR_MESSAGE);
    };

    const toBpiSubject = await this.bpiSubjectStorageAgent.getBpiSubjectById(
      toBpiSubjectId,
    );

    if (!toBpiSubject) {
      throw new NotFoundException(NOT_FOUND_ERR_MESSAGE);
    };

    return [fromBpiSubject, toBpiSubject];
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
