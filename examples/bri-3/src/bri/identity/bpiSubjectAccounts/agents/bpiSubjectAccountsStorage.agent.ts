import { Mapper } from '@automapper/core';
import { InjectMapper } from '@automapper/nestjs';
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../../../prisma/prisma.service';
import { NOT_FOUND_ERR_MESSAGE } from '../api/err.messages';
import { BpiSubjectAccount } from '../models/bpiSubjectAccount';

// Repositories are the only places that talk the Prisma language of models.
// They are always mapped to and from domain objects so that the business layer of the application
// does not have to care about the ORM.
@Injectable()
export class BpiSubjectAccountStorageAgent extends PrismaService {
  constructor(@InjectMapper() private readonly mapper: Mapper) {
    super();
  }

  async getBpiSubjectAccountById(id: string): Promise<BpiSubjectAccount> {
    const bpiSubjectAccountModel = await this.bpiSubjectAccount.findUnique({
      where: { id: id },
      include: { ownerBpiSubject: true, creatorBpiSubject: true },
    });

    if (!bpiSubjectAccountModel) {
      throw new NotFoundException(NOT_FOUND_ERR_MESSAGE);
    }

    return this.mapper.map(
      bpiSubjectAccountModel,
      BpiSubjectAccount,
      BpiSubjectAccount,
    );
  }

  async getAllBpiSubjectAccounts(): Promise<BpiSubjectAccount[]> {
    const bpiSubjectAccountsModels = await this.bpiSubjectAccount.findMany({
      include: { ownerBpiSubject: true, creatorBpiSubject: true },
    });
    return bpiSubjectAccountsModels.map((bp) => {
      return this.mapper.map(bp, BpiSubjectAccount, BpiSubjectAccount);
    });
  }

  async createNewBpiSubjectAccount(
    bpiSubjectAccount: BpiSubjectAccount,
  ): Promise<BpiSubjectAccount> {
    const newBpiSubjectAccountModel = await this.bpiSubjectAccount.create({
      data: {
        creatorBpiSubjectId: bpiSubjectAccount.creatorBpiSubject.id,
        ownerBpiSubjectId: bpiSubjectAccount.ownerBpiSubject.id,
        authenticationPolicy: bpiSubjectAccount.authenticationPolicy,
        authorizationPolicy: bpiSubjectAccount.authorizationPolicy,
        verifiableCredential: bpiSubjectAccount.verifiableCredential,
        recoveryKey: bpiSubjectAccount.recoveryKey,
      },
      include: { ownerBpiSubject: true, creatorBpiSubject: true },
    });

    return this.mapper.map(
      newBpiSubjectAccountModel,
      BpiSubjectAccount,
      BpiSubjectAccount,
    );
  }

  async updateBpiSubjectAccount(
    bpiSubjectAccount: BpiSubjectAccount,
  ): Promise<BpiSubjectAccount> {
    const newBpiSubjectAccountModel = await this.bpiSubjectAccount.update({
      where: { id: bpiSubjectAccount.id },
      data: {
        creatorBpiSubjectId: bpiSubjectAccount.creatorBpiSubject.id,
        ownerBpiSubjectId: bpiSubjectAccount.ownerBpiSubject.id,
        authenticationPolicy: bpiSubjectAccount.authenticationPolicy,
        authorizationPolicy: bpiSubjectAccount.authorizationPolicy,
        verifiableCredential: bpiSubjectAccount.verifiableCredential,
        recoveryKey: bpiSubjectAccount.recoveryKey,
      },
      include: { ownerBpiSubject: true, creatorBpiSubject: true },
    });

    return this.mapper.map(
      newBpiSubjectAccountModel,
      BpiSubjectAccount,
      BpiSubjectAccount,
    );
  }

  async deleteBpiSubjectAccount(
    bpiSubjectAccount: BpiSubjectAccount,
  ): Promise<void> {
    await this.bpiSubjectAccount.delete({
      where: { id: bpiSubjectAccount.id },
    });
  }
}
