import { Mapper } from '@automapper/core';
import { InjectMapper } from '@automapper/nestjs';
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../../prisma/prisma.service';
import { NOT_FOUND_ERR_MESSAGE } from '../api/err.messages';
import { BpiMessage } from '../models/bpiMessage';

@Injectable()
export class BpiMessageStorageAgent extends PrismaService {
  constructor(@InjectMapper() private mapper: Mapper) {
    super();
  }

  async getBpiMessageById(id: string): Promise<BpiMessage> {
    const bpiMessageModel = await this.message.findUnique({
      where: { id },
    });

    if (!bpiMessageModel) {
      throw new NotFoundException(NOT_FOUND_ERR_MESSAGE);
    }

    return this.mapper.map(bpiMessageModel, BpiMessage, BpiMessage);
  }

  async getAllBpiMessages(): Promise<BpiMessage[]> {
    const bpiMessageModels = await this.message.findMany();

    return bpiMessageModels.map((bpiMessageModel) => {
      return this.mapper.map(bpiMessageModel, BpiMessage, BpiMessage);
    });
  }

  async createNewBpiMessage(bpiMessage: BpiMessage): Promise<BpiMessage> {
    const newBpiMessageModel = await this.message.create({
      data: {
        id: bpiMessage.id,
        fromBpiSubjectId: bpiMessage.FromBpiSubject.id,
        toBpiSubjectId: bpiMessage.ToBpiSubject.id,
        content: bpiMessage.content,
        signature: bpiMessage.signature,
        type: bpiMessage.type,
      },
      include: { FromBpiSubject: true, ToBpiSubject: true },
    });

    return this.mapper.map(newBpiMessageModel, BpiMessage, BpiMessage);
  }

  async updateBpiMessage(bpiMessage: BpiMessage): Promise<BpiMessage> {
    const updatedBpiMessageModel = await this.message.update({
      where: { id: bpiMessage.id },
      data: {
        id: bpiMessage.id,
        fromBpiSubjectId: bpiMessage.FromBpiSubject.id,
        toBpiSubjectId: bpiMessage.ToBpiSubject.id,
        content: bpiMessage.content,
        signature: bpiMessage.signature,
        type: bpiMessage.type,
      },
    });

    return this.mapper.map(updatedBpiMessageModel, BpiMessage, BpiMessage);
  }

  async deleteBpiMessage(bpiMessage: BpiMessage): Promise<void> {
    await this.message.delete({
      where: { id: bpiMessage.id },
    });
  }
}
