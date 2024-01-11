import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaMapper } from '../../../../shared/prisma/prisma.mapper';
import { PrismaService } from '../../../../shared/prisma/prisma.service';
import { NOT_FOUND_ERR_MESSAGE } from '../api/err.messages';
import { BpiSubject } from '../models/bpiSubject';
import { BpiSubjectRole, BpiSubjectRoleName } from '../models/bpiSubjectRole';

// Repositories are the only places that talk the Prisma language of models.
// They are always mapped to and from domain objects so that the business layer of the application
// does not have to care about the ORM.
@Injectable()
export class BpiSubjectStorageAgent extends PrismaService {
  constructor(
    private readonly mapper: PrismaMapper,
    private readonly prisma: PrismaService,
  ) {
    super();
  }

  async getBpiSubjectById(id: string): Promise<BpiSubject | undefined> {
    const bpiSubjectModel = await this.prisma.bpiSubject.findUnique({
      where: { id },
      include: {
        roles: true,
      },
    });

    if (!bpiSubjectModel) {
      return undefined;
    }

    return this.mapper.mapBpiSubjectPrismaModelToDomainObject(bpiSubjectModel);
  }

  async getAllBpiSubjects(): Promise<BpiSubject[]> {
    const bpiSubjectModels = await this.prisma.bpiSubject.findMany();
    return bpiSubjectModels.map((bpiSubjectModel) => {
      return this.mapper.mapBpiSubjectPrismaModelToDomainObject(
        bpiSubjectModel,
      );
    });
  }

  async getBpiSubjectsById(ids: string[]): Promise<BpiSubject[]> {
    const bpiSubjectModels = await this.prisma.bpiSubject.findMany({
      where: {
        id: { in: ids },
      },
      include: { roles: true },
    });
    return bpiSubjectModels.map((bpiSubjectModel) => {
      return this.mapper.mapBpiSubjectPrismaModelToDomainObject(
        bpiSubjectModel,
      );
    });
  }

  async getBpiSubjectRoleByName(
    name: BpiSubjectRoleName,
  ): Promise<BpiSubjectRole> {
    const bpiSubjectRole = await this.prisma.bpiSubjectRole.findUnique({
      where: { name },
    });

    if (!bpiSubjectRole) {
      throw new NotFoundException(NOT_FOUND_ERR_MESSAGE);
    }
    return this.mapper.mapBpiSubjectRolePrismaModelToDomainObject(
      bpiSubjectRole,
    );
  }

  async storeNewBpiSubject(bpiSubject: BpiSubject): Promise<BpiSubject> {
    bpiSubject.publicKey = bpiSubject.publicKey.toLowerCase();
    const newBpiSubjectModel = await this.prisma.bpiSubject.create({
      data: {
        ...bpiSubject,
        roles: {
          connect: bpiSubject.roles.map((r) => {
            return {
              id: r.id,
            };
          }),
        },
      },
    });

    return this.mapper.mapBpiSubjectPrismaModelToDomainObject(
      newBpiSubjectModel,
    );
  }

  async updateBpiSubject(bpiSubject: BpiSubject): Promise<BpiSubject> {
    const updatedBpiSubjectModel = await this.prisma.bpiSubject.update({
      where: { id: bpiSubject.id },
      data: {
        ...bpiSubject,
        roles: {
          connect: bpiSubject.roles.map((r) => {
            return {
              id: r.id,
            };
          }),
        },
      },
    });
    return this.mapper.mapBpiSubjectPrismaModelToDomainObject(
      updatedBpiSubjectModel,
    );
  }

  async deleteBpiSubject(bpiSubject: BpiSubject): Promise<void> {
    await this.prisma.bpiSubject.delete({
      where: { id: bpiSubject.id },
    });
  }

  async getBpiSubjectByPublicKey(publicKey: string): Promise<BpiSubject> {
    const bpiSubjectModel = await this.prisma.bpiSubject.findFirst({
      where: {
        publicKey: publicKey,
      },
      include: {
        roles: true,
      },
    });
    if (!bpiSubjectModel) {
      throw new NotFoundException(NOT_FOUND_ERR_MESSAGE);
    }
    return this.mapper.mapBpiSubjectPrismaModelToDomainObject(bpiSubjectModel);
  }
}
