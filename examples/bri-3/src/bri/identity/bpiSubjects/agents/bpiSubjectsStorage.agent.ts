import { Injectable, NotFoundException, UseInterceptors } from '@nestjs/common';
import { PrismaService } from '../../../../../prisma/prisma.service';
import { NOT_FOUND_ERR_MESSAGE } from '../api/err.messages';
import { BpiSubject } from '../models/bpiSubject';
import { getType } from 'tst-reflect';
import { IdentityProfile } from '../../identity.mapper.profile';
import { InjectMapper } from '@automapper/nestjs';
import { BpiSubjectDto } from '../api/dtos/response/bpiSubject.dto';
import { Mapper } from '@automapper/core';

// Repositories are the only places that talk the Prisma language of models.
// They are always mapped to and from domain objects so that the business layer of the application
// does not have to care about the ORM.
@Injectable()
export class BpiSubjectStorageAgent extends PrismaService {
  constructor(
    @InjectMapper() private readonly autoMapper: Mapper
    ) {
    super();
  }

  async getBpiSubjectById(id: string): Promise<BpiSubject> {
    // const bpiSubjectModel = await this.bpiSubject.findUnique({
    //   where: { id },
    // });

    // if (!bpiSubjectModel) {
    //   throw new NotFoundException(NOT_FOUND_ERR_MESSAGE);
    // }
    // return this.mapper.map(
    //   bpiSubjectModel,
    //   getType<BpiSubject>(),
    // ) as BpiSubject;
    // //return bpiSubjectModel;
    return undefined;
  }

  async getAllBpiSubjects(): Promise<BpiSubject[]> {
    // const bpiSubjectModels = await this.bpiSubject.findMany();
    // return bpiSubjectModels.map((bpiSubjectModel) => {
    //   return this.mapper.map(
    //     bpiSubjectModel,
    //     getType<BpiSubject>(),
    //   ) as BpiSubject;
    // });
    return undefined;
  }

  //@UseInterceptors(MapInterceptor(BpiSubject, BpiSubject))
  async createNewBpiSubject(bpiSubject: BpiSubject): Promise<BpiSubject> {
    const newBpiSubjectModel = await this.bpiSubject.create({
      //data: this.mapper.map(bpiSubject, getType<BpiSubject>()) as BpiSubject,
      data: bpiSubject
    });

    const converted = this.autoMapper.map(newBpiSubjectModel, BpiSubject, BpiSubject);
    return converted;

    // return this.mapper.map(
    //   newBpiSubjectModel,
    //   getType<BpiSubject>(),
    // ) as BpiSubject;

    //return newBpiSubjectModel;
  }

  async updateBpiSubject(bpiSubject: BpiSubject): Promise<BpiSubject> {
    // const updatedBpiSubjectModel = await this.bpiSubject.update({
    //   where: { id: bpiSubject.id },
    //   data: this.mapper.map(bpiSubject, getType<BpiSubject>(), {
    //     exclude: ['id'],
    //   }) as BpiSubject,
    // });
    // return this.mapper.map(
    //   updatedBpiSubjectModel,
    //   getType<BpiSubject>(),
    // ) as BpiSubject;
    return undefined;
  }

  async deleteBpiSubject(bpiSubject: BpiSubject): Promise<void> {
    await this.bpiSubject.delete({
      where: { id: bpiSubject.id },
    });
  }
}
