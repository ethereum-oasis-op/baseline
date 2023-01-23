import { Mapper } from '@automapper/core';
import { InjectMapper } from '@automapper/nestjs';
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../../../prisma/prisma.service';
import { NOT_FOUND_ERR_MESSAGE } from '../api/err.messages';
import { BpiAccount } from '../models/bpiAccount';

// Repositories are the only places that talk the Prisma language of models.
// They are always mapped to and from domain objects so that the business layer of the application
// does not have to care about the ORM.
@Injectable()
export class BpiAccountStorageAgent extends PrismaService {
  constructor(@InjectMapper() private readonly mapper: Mapper) {
    super();
  }

  async getAccountById(id: string): Promise<BpiAccount> {
    const bpiAccountModel = await this.bpiAccount.findUnique({
      where: { id },
      include: {
        ownerBpiSubjectAccounts: {
          include: {
            creatorBpiSubject: true,
            ownerBpiSubject: true,
          },
        },
      },
    });

    if (!bpiAccountModel) {
      throw new NotFoundException(NOT_FOUND_ERR_MESSAGE);
    }

    return this.mapper.map(bpiAccountModel, BpiAccount, BpiAccount);
  }

  async getAllBpiAccounts(): Promise<BpiAccount[]> {
    const bpiAccountModels = await this.bpiAccount.findMany({
      include: {
        ownerBpiSubjectAccounts: {
          include: {
            creatorBpiSubject: true,
            ownerBpiSubject: true,
          },
        },
      },
    });

    return bpiAccountModels.map((bp) => {
      return this.mapper.map(bp, BpiAccount, BpiAccount);
    });
  }

  async createNewBpiAccount(bpiAccount: BpiAccount): Promise<BpiAccount> {
    const connectedOwnerBpiAccounts = bpiAccount.ownerBpiSubjectAccounts.map(
      (o) => {
        return {
          id: o.id,
        };
      },
    );
    const newBpiAccountModel = await this.bpiAccount.create({
      data: {
        nonce: bpiAccount.nonce,
        ownerBpiSubjectAccounts: {
          connect: connectedOwnerBpiAccounts,
        },
        authorizationCondition: bpiAccount.authorizationCondition,
        stateObjectProverSystem: bpiAccount.stateObjectProverSystem,
        stateObjectStorage: bpiAccount.stateObjectStorage,
      },
    });

    return this.mapper.map(newBpiAccountModel, BpiAccount, BpiAccount);
  }

  async updateBpiAccount(bpiAccount: BpiAccount): Promise<BpiAccount> {
    const newBpiAccountModel = await this.bpiAccount.update({
      where: { id: bpiAccount.id },
      data: {
        nonce: bpiAccount.nonce,
      },
    });

    return this.mapper.map(newBpiAccountModel, BpiAccount, BpiAccount);
  }

  async deleteBpiAccount(bpiAccount: BpiAccount): Promise<void> {
    await this.bpiAccount.delete({
      where: { id: bpiAccount.id },
    });
  }
}
