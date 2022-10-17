import { Injectable, NotFoundException } from '@nestjs/common';
import Mapper from '../../utils/mapper';
import { NOT_FOUND_ERR_MESSAGE } from '../api/err.messages';
import { BpiMessage } from '../models/bpiMessage';
import { getType } from 'tst-reflect';

@Injectable()
export class MockBpiMessageStorageAgent {
  constructor(private readonly mapper: Mapper) {}

  private bpiMessagesStore: BpiMessage[] = [];

  async getBpiMessageById(id: string): Promise<BpiMessage> {
    const bpiMessage = this.bpiMessagesStore.find((bp) => bp.id === id);
    if (!bpiMessage) {
      throw new NotFoundException(NOT_FOUND_ERR_MESSAGE);
    }
    return this.mapper.map(bpiMessage, getType<BpiMessage>()) as BpiMessage;
  }

  async getAllBpiMessages(): Promise<BpiMessage[]> {
    return Promise.resolve(
      this.bpiMessagesStore.map(
        (bpiMessage) =>
          this.mapper.map(bpiMessage, getType<BpiMessage>()) as BpiMessage,
      ),
    );
  }

  async createNewBpiMessage(bpiMessage: BpiMessage): Promise<BpiMessage> {
    const createdBp = this.mapper.map(
      new BpiMessage(
        bpiMessage.id,
        bpiMessage.from,
        bpiMessage.to,
        bpiMessage.content,
        bpiMessage.signature,
        bpiMessage.type,
      ),
      getType<BpiMessage>(),
    ) as BpiMessage;

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
