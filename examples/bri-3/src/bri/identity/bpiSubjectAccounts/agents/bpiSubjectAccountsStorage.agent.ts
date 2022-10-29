import { Mapper } from '@automapper/core';
import { InjectMapper } from '@automapper/nestjs';
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../../../prisma/prisma.service';
import { BpiSubject } from '../../bpiSubjects/models/bpiSubject';
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

    return new BpiSubjectAccount(
      bpiSubjectAccountModel.id,
      this.mapper.map(
        bpiSubjectAccountModel.creatorBpiSubject,
        BpiSubject,
        BpiSubject,
      ),
      this.mapper.map(
        bpiSubjectAccountModel.ownerBpiSubject,
        BpiSubject,
        BpiSubject,
      ),
    );
  }

  async getAllBpiSubjectAccounts(): Promise<BpiSubjectAccount[]> {
    const bpiSubjectAccountsModels = await this.bpiSubjectAccount.findMany({
      include: { ownerBpiSubject: true, creatorBpiSubject: true },
    });
    return bpiSubjectAccountsModels.map((bp) => {
      return new BpiSubjectAccount(
        bp.id,
        this.mapper.map(bp.creatorBpiSubject, BpiSubject, BpiSubject),
        this.mapper.map(bp.ownerBpiSubject, BpiSubject, BpiSubject),
      );
    });
  }

  async createNewBpiSubjectAccount(
    bpiSubjectAccount: BpiSubjectAccount,
  ): Promise<BpiSubjectAccount> {
    const newBpiSubjectAccountModel = await this.bpiSubjectAccount.create({
      // TODO: Write generic mapper domainObject -> prismaModel
      data: {
        creatorBpiSubjectId: bpiSubjectAccount.creatorBpiSubject.id,
        ownerBpiSubjectId: bpiSubjectAccount.ownerBpiSubject.id,
      },
      include: { ownerBpiSubject: true, creatorBpiSubject: true },
    });

    return new BpiSubjectAccount(
      newBpiSubjectAccountModel.id,
      this.mapper.map(
        newBpiSubjectAccountModel.creatorBpiSubject,
        BpiSubject,
        BpiSubject,
      ),
      this.mapper.map(
        newBpiSubjectAccountModel.ownerBpiSubject,
        BpiSubject,
        BpiSubject,
      ),
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
      },
      include: { ownerBpiSubject: true, creatorBpiSubject: true },
    });

    return new BpiSubjectAccount(
      newBpiSubjectAccountModel.id,
      this.mapper.map(
        newBpiSubjectAccountModel.creatorBpiSubject,
        BpiSubject,
        BpiSubject,
      ),
      this.mapper.map(
        newBpiSubjectAccountModel.ownerBpiSubject,
        BpiSubject,
        BpiSubject,
      ),
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
