import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaMapper } from '../../../../shared/prisma/prisma.mapper';
import { PrismaService } from '../../../../shared/prisma/prisma.service';
import { NOT_FOUND_ERR_MESSAGE } from '../api/err.messages';
import { BpiSubject } from '../models/bpiSubject';
import { BpiSubjectRole, BpiSubjectRoleName } from '../models/bpiSubjectRole';
import { PublicKey } from '../models/publicKey';

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

    return this.mapper.map(bpiSubjectModel, BpiSubject);
  }

  async getAllBpiSubjects(): Promise<BpiSubject[]> {
    const bpiSubjectModels = await this.prisma.bpiSubject.findMany();
    return bpiSubjectModels.map((bpiSubjectModel) => {
      return this.mapper.map(bpiSubjectModel, BpiSubject);
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
      return this.mapper.map(bpiSubjectModel, BpiSubject);
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
    return this.mapper.map(bpiSubjectRole, BpiSubjectRole);
  }

  async storePublicKey(
    id: string,
    type: string,
    value: string,
    bpiSubjectId: string,
  ): Promise<void> {
    await this.prisma.publicKey.create({
      data: {
        id: id,
        type: type,
        value: value,
        bpiSubjectId: bpiSubjectId,
      },
    });
  }

  async updatePublicKey(
    type: string,
    value: string,
    bpiSubjectId: string,
  ): Promise<PublicKey> {
    const updatedPublicKey = await this.prisma.publicKey.update({
      where: { type_bpiSubjectId: { type: type, bpiSubjectId: bpiSubjectId } },
      data: {
        value: value,
      },
    });

    return this.mapper.mapPublicKeyPrismaModelToDomainObject(updatedPublicKey);
  }
  async storeNewBpiSubject(bpiSubject: BpiSubject): Promise<BpiSubject> {
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
        publicKey: {
          connect: bpiSubject.publicKey.map((pk) => {
            return {
              id: pk.id,
            };
          }),
        },
      },
    });

    return this.mapper.map(newBpiSubjectModel, BpiSubject);
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
        publicKey: {
          connect: bpiSubject.publicKey.map((pk) => {
            return {
              id: pk.id,
            };
          }),
        },
      },
    });
    return this.mapper.map(updatedBpiSubjectModel, BpiSubject);
  }

  async deleteBpiSubject(bpiSubject: BpiSubject): Promise<void> {
    await this.prisma.bpiSubject.delete({
      where: { id: bpiSubject.id },
    });
  }

  async getBpiSubjectByPublicKey(publicKey: string): Promise<BpiSubject> {
    const bpiSubjectKey = await this.prisma.publicKey.findUnique({
      where: { value: publicKey },
    });

    if (!bpiSubjectKey) {
      throw new NotFoundException(NOT_FOUND_ERR_MESSAGE);
    }
    const bpiSubjectModel = await this.prisma.bpiSubject.findFirst({
      where: { id: bpiSubjectKey.id },
    });

    if (!bpiSubjectModel) {
      throw new NotFoundException(NOT_FOUND_ERR_MESSAGE);
    }
    return this.mapper.map(bpiSubjectModel, BpiSubject);
  }
}
