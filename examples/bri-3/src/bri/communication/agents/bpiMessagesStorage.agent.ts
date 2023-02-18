import { Mapper } from '@automapper/core';
import { InjectMapper } from '@automapper/nestjs';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../prisma/prisma.service';
import { BpiMessage } from '../models/bpiMessage';

@Injectable()
export class BpiMessageStorageAgent extends PrismaService {
  constructor(@InjectMapper() private mapper: Mapper) {
    super();
  }

  async getBpiMessageById(id: string): Promise<BpiMessage> {
    const bpiMessageModel = await this.message.findUnique({
      where: { id },
      include: { fromBpiSubject: true, toBpiSubject: true },
    });

    if (!bpiMessageModel) {
      return null;
    }

    return this.mapper.map(bpiMessageModel, BpiMessage, BpiMessage);
  }

  async getAllBpiMessages(): Promise<BpiMessage[]> {
    const bpiMessageModels = await this.message.findMany();

    return bpiMessageModels.map((bpiMessageModel) => {
      return this.mapper.map(bpiMessageModel, BpiMessage, BpiMessage);
    });
  }

  async storeNewBpiMessage(bpiMessage: BpiMessage): Promise<BpiMessage> {
    const newBpiMessageModel = await this.message.create({
      data: {
        id: bpiMessage.id,
        fromBpiSubjectId: bpiMessage.fromBpiSubject.id,
        toBpiSubjectId: bpiMessage.toBpiSubject.id,
        content: bpiMessage.content,
        signature: bpiMessage.signature,
        type: bpiMessage.type,
      },
      include: { fromBpiSubject: true, toBpiSubject: true },
    });

    return this.mapper.map(newBpiMessageModel, BpiMessage, BpiMessage);
  }

  async updateBpiMessage(bpiMessage: BpiMessage): Promise<BpiMessage> {
    const updatedBpiMessageModel = await this.message.update({
      where: { id: bpiMessage.id },
      data: {
        id: bpiMessage.id,
        fromBpiSubjectId: bpiMessage.fromBpiSubject.id,
        toBpiSubjectId: bpiMessage.toBpiSubject.id,
        content: bpiMessage.content,
        signature: bpiMessage.signature,
        type: bpiMessage.type,
      },
      include: { fromBpiSubject: true, toBpiSubject: true },
    });

    return this.mapper.map(updatedBpiMessageModel, BpiMessage, BpiMessage);
  }

  async deleteBpiMessage(bpiMessage: BpiMessage): Promise<void> {
    await this.message.delete({
      where: { id: bpiMessage.id },
    });
  }
}
