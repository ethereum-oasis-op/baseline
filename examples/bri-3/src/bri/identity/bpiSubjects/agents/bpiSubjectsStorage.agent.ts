import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../../../prisma/prisma.service';
import { NOT_FOUND_ERR_MESSAGE } from '../api/err.messages';
import { BpiSubject } from '../models/bpiSubject';
import { InjectMapper } from '@automapper/nestjs';
import { Mapper } from '@automapper/core';

// Repositories are the only places that talk the Prisma language of models.
// They are always mapped to and from domain objects so that the business layer of the application
// does not have to care about the ORM.
@Injectable()
export class BpiSubjectStorageAgent extends PrismaService {
  constructor(@InjectMapper() private autoMapper: Mapper) {
    super();
  }

  async getBpiSubjectById(id: string): Promise<BpiSubject> {
    const bpiSubjectModel = await this.bpiSubject.findUnique({
      where: { id },
    });

    if (!bpiSubjectModel) {
      throw new NotFoundException(NOT_FOUND_ERR_MESSAGE);
    }
    return this.autoMapper.map(bpiSubjectModel, BpiSubject, BpiSubject);
  }

  async getAllBpiSubjects(): Promise<BpiSubject[]> {
    const bpiSubjectModels = await this.bpiSubject.findMany();
    return bpiSubjectModels.map((bpiSubjectModel) => {
      return this.autoMapper.map(bpiSubjectModel, BpiSubject, BpiSubject);
    });
  }

  async createNewBpiSubject(bpiSubject: BpiSubject): Promise<BpiSubject> {
    const newBpiSubjectModel = await this.bpiSubject.create({
      data: bpiSubject,
    });

    return this.autoMapper.map(newBpiSubjectModel, BpiSubject, BpiSubject);
  }

  async updateBpiSubject(bpiSubject: BpiSubject): Promise<BpiSubject> {
    const updatedBpiSubjectModel = await this.bpiSubject.update({
      where: { id: bpiSubject.id },
      data: this.autoMapper.map(bpiSubject, BpiSubject, BpiSubject),
    });
    return this.autoMapper.map(updatedBpiSubjectModel, BpiSubject, BpiSubject);
  }

  async deleteBpiSubject(bpiSubject: BpiSubject): Promise<void> {
    await this.bpiSubject.delete({
      where: { id: bpiSubject.id },
    });
  }
}
