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
  async getBpiSubjectAccountById(id: string): Promise<BpiSubjectAccount> {
    const bpiSubjectAccountModel = await this.bpiSubjectAccount.findUnique({
      where: { id: id },
      include: { OwnerBpiSubject: true, CreatorBpiSubject: true },
    });

    if (!bpiSubjectAccountModel) {
      throw new NotFoundException(NOT_FOUND_ERR_MESSAGE);
    }

    const creatorBpiSubject = new BpiSubject(
      bpiSubjectAccountModel.CreatorBpiSubject.id,
      bpiSubjectAccountModel.CreatorBpiSubject.name,
      bpiSubjectAccountModel.CreatorBpiSubject.description,
      bpiSubjectAccountModel.CreatorBpiSubject.type,
      bpiSubjectAccountModel.CreatorBpiSubject.publicKey,
    );
    const ownerBpiSubject = new BpiSubject(
      bpiSubjectAccountModel.OwnerBpiSubject.id,
      bpiSubjectAccountModel.OwnerBpiSubject.name,
      bpiSubjectAccountModel.OwnerBpiSubject.description,
      bpiSubjectAccountModel.OwnerBpiSubject.type,
      bpiSubjectAccountModel.OwnerBpiSubject.publicKey,
    );
    return new BpiSubjectAccount( // TODO: Write generic mapper prismaModel -> domainObject
      bpiSubjectAccountModel.id,
      creatorBpiSubject,
      ownerBpiSubject,
    );
  }

  async getAllBpiSubjectAccounts(): Promise<BpiSubjectAccount[]> {
    const bpiSubjectAccountsModels = await this.bpiSubjectAccount.findMany({
      include: { OwnerBpiSubject: true, CreatorBpiSubject: true },
    });
    return bpiSubjectAccountsModels.map((bp) => {
      return new BpiSubjectAccount(
        bp.id,
        new BpiSubject(
          bp.CreatorBpiSubject.id,
          bp.CreatorBpiSubject.name,
          bp.CreatorBpiSubject.description,
          bp.CreatorBpiSubject.type,
          bp.CreatorBpiSubject.publicKey,
        ),
        new BpiSubject(
          bp.OwnerBpiSubject.id,
          bp.OwnerBpiSubject.name,
          bp.OwnerBpiSubject.description,
          bp.OwnerBpiSubject.type,
          bp.OwnerBpiSubject.publicKey,
        ),
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
      include: { OwnerBpiSubject: true, CreatorBpiSubject: true },
    });

    return new BpiSubjectAccount(
      newBpiSubjectAccountModel.id,
      new BpiSubject(
        newBpiSubjectAccountModel.CreatorBpiSubject.id,
        newBpiSubjectAccountModel.CreatorBpiSubject.name,
        newBpiSubjectAccountModel.CreatorBpiSubject.description,
        newBpiSubjectAccountModel.CreatorBpiSubject.type,
        newBpiSubjectAccountModel.CreatorBpiSubject.publicKey,
      ),
      new BpiSubject(
        newBpiSubjectAccountModel.OwnerBpiSubject.id,
        newBpiSubjectAccountModel.OwnerBpiSubject.name,
        newBpiSubjectAccountModel.OwnerBpiSubject.description,
        newBpiSubjectAccountModel.OwnerBpiSubject.type,
        newBpiSubjectAccountModel.OwnerBpiSubject.publicKey,
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
      include: { OwnerBpiSubject: true, CreatorBpiSubject: true },
    });

    return new BpiSubjectAccount(
      newBpiSubjectAccountModel.id,
      new BpiSubject(
        newBpiSubjectAccountModel.CreatorBpiSubject.id,
        newBpiSubjectAccountModel.CreatorBpiSubject.name,
        newBpiSubjectAccountModel.CreatorBpiSubject.description,
        newBpiSubjectAccountModel.CreatorBpiSubject.type,
        newBpiSubjectAccountModel.CreatorBpiSubject.publicKey,
      ),
      new BpiSubject(
        newBpiSubjectAccountModel.OwnerBpiSubject.id,
        newBpiSubjectAccountModel.OwnerBpiSubject.name,
        newBpiSubjectAccountModel.OwnerBpiSubject.description,
        newBpiSubjectAccountModel.OwnerBpiSubject.type,
        newBpiSubjectAccountModel.OwnerBpiSubject.publicKey,
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
