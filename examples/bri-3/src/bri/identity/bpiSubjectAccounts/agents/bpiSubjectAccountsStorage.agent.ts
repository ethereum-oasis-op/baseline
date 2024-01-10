import { Injectable } from '@nestjs/common';
import { PrismaMapper } from '../../../../../prisma/prisma.mapper';
import { PrismaService } from '../../../../shared/prisma/prisma.service';
import { BpiSubjectAccount } from '../models/bpiSubjectAccount';

// Repositories are the only places that talk the Prisma language of models.
// They are always mapped to and from domain objects so that the business layer of the application
// does not have to care about the ORM.
@Injectable()
export class BpiSubjectAccountStorageAgent {
  constructor(
    private mapper: PrismaMapper,
    private readonly prisma: PrismaService,
  ) {}

  async getBpiSubjectAccountById(
    id: string,
  ): Promise<BpiSubjectAccount | undefined> {
    const bpiSubjectAccountModel =
      await this.prisma.bpiSubjectAccount.findUnique({
        where: { id: id },
        include: { ownerBpiSubject: true, creatorBpiSubject: true },
      });

    if (!bpiSubjectAccountModel) {
      return undefined;
    }

    return this.mapper.mapBpiSubjectAccountPrismaModelToDomainObject(
      bpiSubjectAccountModel,
    );
  }

  async getAllBpiSubjectAccounts(): Promise<BpiSubjectAccount[]> {
    const bpiSubjectAccountsModels =
      await this.prisma.bpiSubjectAccount.findMany({
        include: { ownerBpiSubject: true, creatorBpiSubject: true },
      });
    return bpiSubjectAccountsModels.map((bp) => {
      return this.mapper.mapBpiSubjectAccountPrismaModelToDomainObject(bp);
    });
  }

  async storeNewBpiSubjectAccount(
    bpiSubjectAccount: BpiSubjectAccount,
  ): Promise<BpiSubjectAccount> {
    const newBpiSubjectAccountModel =
      await this.prisma.bpiSubjectAccount.create({
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

    return this.mapper.mapBpiSubjectAccountPrismaModelToDomainObject(
      newBpiSubjectAccountModel,
    );
  }

  async updateBpiSubjectAccount(
    bpiSubjectAccount: BpiSubjectAccount,
  ): Promise<BpiSubjectAccount> {
    const newBpiSubjectAccountModel =
      await this.prisma.bpiSubjectAccount.update({
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

    return this.mapper.mapBpiSubjectAccountPrismaModelToDomainObject(
      newBpiSubjectAccountModel,
    );
  }

  async deleteBpiSubjectAccount(
    bpiSubjectAccount: BpiSubjectAccount,
  ): Promise<void> {
    await this.prisma.bpiSubjectAccount.delete({
      where: { id: bpiSubjectAccount.id },
    });
  }
}
