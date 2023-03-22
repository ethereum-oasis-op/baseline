import { Injectable } from '@nestjs/common';
import { BpiMessage } from '../models/bpiMessage';

@Injectable()
export class MockBpiMessageStorageAgent {
  private bpiMessagesStore: BpiMessage[] = [];

  async getBpiMessageById(id: string): Promise<BpiMessage> {
    const bpiMessage = this.bpiMessagesStore.find((bp) => bp.id === id);
    if (!bpiMessage) {
      return null;
    }
    return bpiMessage;
  }

  async getAllBpiMessages(): Promise<BpiMessage[]> {
    return Promise.resolve(this.bpiMessagesStore);
  }

  async storeNewBpiMessage(bpiMessage: BpiMessage): Promise<BpiMessage> {
    const createdBpiMessage = new BpiMessage(
      bpiMessage.id,
      bpiMessage.fromBpiSubject,
      bpiMessage.toBpiSubject,
      bpiMessage.content,
      bpiMessage.signature,
      bpiMessage.type,
    );

    this.bpiMessagesStore.push(createdBpiMessage);
    return Promise.resolve(createdBpiMessage);
  }

  async updateBpiMessage(bpiMessage: BpiMessage): Promise<BpiMessage> {
    const bpiMessageToUpdate = this.bpiMessagesStore.find(
      (bp) => bp.id === bpiMessage.id,
    );
    Object.assign(bpiMessageToUpdate, bpiMessage) as BpiMessage;
    return Promise.resolve(bpiMessageToUpdate);
  }

  async deleteBpiMessage(bpiMessage: BpiMessage): Promise<void> {
    const bpiMessageToDeleteIndex = this.bpiMessagesStore.findIndex(
      (bp) => bp.id === bpiMessage.id,
    );
    this.bpiMessagesStore.splice(bpiMessageToDeleteIndex, 1);
  }
}
