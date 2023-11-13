import { Mapper } from '@automapper/core';
import { InjectMapper } from '@automapper/nestjs';
import { Injectable } from '@nestjs/common';
import { EncryptionService } from '../../../shared/encryption/encryption.service';
import { BpiMessage } from '../models/bpiMessage';
import { PrismaService } from '../../../shared/prisma/prisma.service';

@Injectable()
export class BpiMessageStorageAgent {
  constructor(
    @InjectMapper() private mapper: Mapper,
    private readonly encryptionService: EncryptionService,
    private readonly prisma: PrismaService,
  ) {}

  async getBpiMessageById(id: string): Promise<BpiMessage | undefined> {
    const bpiMessageModel = await this.prisma.message.findUnique({
      where: { id },
      include: { fromBpiSubject: true, toBpiSubject: true },
    });

    if (!bpiMessageModel) {
      return undefined;
    }

    const bpiMessage = this.mapper.map(bpiMessageModel, BpiMessage, BpiMessage);
    bpiMessage.updateContent(
      await this.encryptionService.decrypt(bpiMessage.content),
    );

    return bpiMessage;
  }

  async getAllBpiMessages(): Promise<BpiMessage[]> {
    const bpiMessageModels = await this.prisma.message.findMany();

    return bpiMessageModels.map((bpiMessageModel) => {
      return this.mapper.map(bpiMessageModel, BpiMessage, BpiMessage);
    });
  }

  async storeNewBpiMessage(bpiMessage: BpiMessage): Promise<BpiMessage> {
    const newBpiMessageModel = await this.prisma.message.create({
      data: {
        id: bpiMessage.id,
        fromBpiSubjectId: bpiMessage.fromBpiSubjectId,
        toBpiSubjectId: bpiMessage.toBpiSubjectId,
        content: await this.encryptionService.encrypt(bpiMessage.content),
        signature: bpiMessage.signature,
        type: bpiMessage.type,
      },
      include: { fromBpiSubject: true, toBpiSubject: true },
    });

    return this.mapper.map(newBpiMessageModel, BpiMessage, BpiMessage);
  }

  async updateBpiMessage(bpiMessage: BpiMessage): Promise<BpiMessage> {
    const updatedBpiMessageModel = await this.prisma.message.update({
      where: { id: bpiMessage.id },
      data: {
        id: bpiMessage.id,
        fromBpiSubjectId: bpiMessage.fromBpiSubject.id,
        toBpiSubjectId: bpiMessage.toBpiSubject.id,
        content: await this.encryptionService.encrypt(bpiMessage.content),
        signature: bpiMessage.signature,
        type: bpiMessage.type,
      },
      include: { fromBpiSubject: true, toBpiSubject: true },
    });

    return this.mapper.map(updatedBpiMessageModel, BpiMessage, BpiMessage);
  }

  async deleteBpiMessage(bpiMessage: BpiMessage): Promise<void> {
    await this.prisma.message.delete({
      where: { id: bpiMessage.id },
    });
  }
}
