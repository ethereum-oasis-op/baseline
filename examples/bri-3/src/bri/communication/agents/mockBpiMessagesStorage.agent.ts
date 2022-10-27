import { Mapper } from '@automapper/core';
import { InjectMapper } from '@automapper/nestjs';
import { Injectable, NotFoundException } from '@nestjs/common';
import { NOT_FOUND_ERR_MESSAGE } from '../api/err.messages';
import { BpiMessage } from '../models/bpiMessage';

@Injectable()
export class MockBpiMessageStorageAgent {
  private bpiMessagesStore: BpiMessage[] = [];

  async getBpiMessageById(id: string): Promise<BpiMessage> {
    const bpiMessage = this.bpiMessagesStore.find((bp) => bp.id === id);
    if (!bpiMessage) {
      throw new NotFoundException(NOT_FOUND_ERR_MESSAGE);
    }
    return bpiMessage;
  }

  async getAllBpiMessages(): Promise<BpiMessage[]> {
    return Promise.resolve(this.bpiMessagesStore);
  }

  async createNewBpiMessage(bpiMessage: BpiMessage): Promise<BpiMessage> {
    const createdBp = new BpiMessage(
      bpiMessage.id,
      bpiMessage.FromBpiSubject,
      bpiMessage.ToBpiSubject,
      bpiMessage.content,
      bpiMessage.signature,
      bpiMessage.type,
    );

    this.bpiMessagesStore.push(createdBp);
    return Promise.resolve(createdBp);
  }

  async updateBpiMessage(bpiMessage: BpiMessage): Promise<BpiMessage> {
    const bpToUpdate = this.bpiMessagesStore.find(
      (bp) => bp.id === bpiMessage.id,
    );
    Object.assign(bpToUpdate, bpiMessage) as BpiMessage;
    return Promise.resolve(bpToUpdate);
  }

  async deleteBpiMessage(bpiMessage: BpiMessage): Promise<void> {
    const bpToDeleteIndex = this.bpiMessagesStore.findIndex(
      (bp) => bp.id === bpiMessage.id,
    );
    this.bpiMessagesStore.splice(bpToDeleteIndex, 1);
  }
}
