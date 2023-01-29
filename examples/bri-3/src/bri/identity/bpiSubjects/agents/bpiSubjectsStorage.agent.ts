import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../../../prisma/prisma.service';
import { NOT_FOUND_ERR_MESSAGE } from '../api/err.messages';
import {
  BpiSubject,
  BpiSubjectRole,
  BpiSubjectRoleName,
} from '../models/bpiSubject';
import { InjectMapper } from '@automapper/nestjs';
import { Mapper } from '@automapper/core';

// Repositories are the only places that talk the Prisma language of models.
// They are always mapped to and from domain objects so that the business layer of the application
// does not have to care about the ORM.
@Injectable()
export class BpiSubjectStorageAgent extends PrismaService {
  constructor(@InjectMapper() private mapper: Mapper) {
    super();
  }

  async getBpiSubjectById(id: string): Promise<BpiSubject> {
    const bpiSubjectModel = await this.bpiSubject.findUnique({
      where: { id },
    });

    if (!bpiSubjectModel) {
      throw new NotFoundException(NOT_FOUND_ERR_MESSAGE);
    }
    return this.mapper.map(bpiSubjectModel, BpiSubject, BpiSubject);
  }

  async getAllBpiSubjects(): Promise<BpiSubject[]> {
    const bpiSubjectModels = await this.bpiSubject.findMany();
    return bpiSubjectModels.map((bpiSubjectModel) => {
      return this.mapper.map(bpiSubjectModel, BpiSubject, BpiSubject);
    });
  }

  async getBpiSubjectsById(ids: string[]): Promise<BpiSubject[]> {
    const bpiSubjectModels = await this.bpiSubject.findMany({
      where: {
        id: { in: ids },
      },
      include: { roles: true },
    });
    return bpiSubjectModels.map((bpiSubjectModel) => {
      return this.mapper.map(bpiSubjectModel, BpiSubject, BpiSubject);
    });
  }

  async getBpiSubjectRoleByName(
    name: BpiSubjectRoleName,
  ): Promise<BpiSubjectRole> {
    const bpiSubjectRole = await this.bpiSubjectRole.findUnique({
      where: { name },
    });

    if (!bpiSubjectRole) {
      throw new NotFoundException(NOT_FOUND_ERR_MESSAGE);
    }
    return this.mapper.map(bpiSubjectRole, BpiSubjectRole, BpiSubjectRole);
  }

  async createNewBpiSubject(bpiSubject: BpiSubject): Promise<BpiSubject> {
    bpiSubject.publicKey = bpiSubject.publicKey.toLowerCase();
    const newBpiSubjectModel = await this.bpiSubject.create({
      data: {
        id: bpiSubject.id,
        name: bpiSubject.name,
        description: bpiSubject.description,
        loginNonce: bpiSubject.loginNonce,
        publicKey: bpiSubject.publicKey,
        type: bpiSubject.type,
        roles: {
          connect: bpiSubject.roles.map((r) => {
            return {
              id: r.id,
            };
          }),
        },
      },
    });

    return this.mapper.map(newBpiSubjectModel, BpiSubject, BpiSubject);
  }

  async updateBpiSubject(bpiSubject: BpiSubject): Promise<BpiSubject> {
    const updatedBpiSubjectModel = await this.bpiSubject.update({
      where: { id: bpiSubject.id },
      data: {
        id: bpiSubject.id,
        name: bpiSubject.name,
        description: bpiSubject.description,
        loginNonce: bpiSubject.loginNonce,
        publicKey: bpiSubject.publicKey,
        type: bpiSubject.type,
        roles: {
          connect: bpiSubject.roles,
        },
      },
    });
    return this.mapper.map(updatedBpiSubjectModel, BpiSubject, BpiSubject);
  }

  async deleteBpiSubject(bpiSubject: BpiSubject): Promise<void> {
    await this.bpiSubject.delete({
      where: { id: bpiSubject.id },
    });
  }

  async getBpiSubjectByPublicKey(publicKey: string): Promise<BpiSubject> {
    const bpiSubjectModel = await this.bpiSubject.findFirst({
      where: {
        publicKey: publicKey.toLowerCase(),
      },
    });
    if (!bpiSubjectModel) {
      throw new NotFoundException(NOT_FOUND_ERR_MESSAGE);
    }
    return this.mapper.map(bpiSubjectModel, BpiSubject, BpiSubject);
  }
}
