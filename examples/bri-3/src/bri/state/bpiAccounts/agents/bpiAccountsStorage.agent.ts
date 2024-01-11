import { Injectable, NotFoundException } from '@nestjs/common';
import MerkleTree from 'merkletreejs';
import { PrismaMapper } from '../../../../shared/prisma/prisma.mapper';
import { PrismaService } from '../../../../shared/prisma/prisma.service';
import { Witness } from '../../../zeroKnowledgeProof/models/witness';
import { StateTreeLeafValueContent } from '../../models/stateTreeLeafValueContent';
import { NOT_FOUND_ERR_MESSAGE } from '../api/err.messages';
import { BpiAccount } from '../models/bpiAccount';

// Repositories are the only places that talk the Prisma language of models.
// They are always mapped to and from domain objects so that the business layer of the application
// does not have to care about the ORM.
@Injectable()
export class BpiAccountStorageAgent {
  constructor(
    private readonly mapper: PrismaMapper,
    private readonly prisma: PrismaService,
  ) {}

  async getAccountById(id: string): Promise<BpiAccount> {
    const bpiAccountModel = await this.prisma.bpiAccount.findUnique({
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

    return this.mapper.mapBpiAccountPrismaModelToDomainObject(bpiAccountModel);
  }

  async getAllBpiAccounts(): Promise<BpiAccount[]> {
    const bpiAccountModels = await this.prisma.bpiAccount.findMany({
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
      return this.mapper.mapBpiAccountPrismaModelToDomainObject(bp);
    });
  }

  async storeNewBpiAccount(bpiAccount: BpiAccount): Promise<BpiAccount> {
    const connectedOwnerBpiAccounts = bpiAccount.ownerBpiSubjectAccounts.map(
      (o) => {
        return {
          id: o.id,
        };
      },
    );
    const newBpiAccountModel = await this.prisma.bpiAccount.create({
      data: {
        nonce: bpiAccount.nonce,
        ownerBpiSubjectAccounts: {
          connect: connectedOwnerBpiAccounts,
        },
        authorizationCondition: bpiAccount.authorizationCondition,
        stateObjectProverSystem: bpiAccount.stateObjectProverSystem,
        stateTree: {
          create: {
            id: bpiAccount.stateTreeId,
            hashAlgName: bpiAccount.stateTree.hashAlgName,
            tree: MerkleTree.marshalTree(bpiAccount.stateTree.tree),
          },
        },
        historyTree: {
          create: {
            id: bpiAccount.historyTreeId,
            hashAlgName: bpiAccount.historyTree.hashAlgName,
            tree: MerkleTree.marshalTree(bpiAccount.historyTree.tree),
          },
        },
      },
    });

    return this.mapper.mapBpiAccountPrismaModelToDomainObject(
      newBpiAccountModel,
    );
  }

  async updateBpiAccount(bpiAccount: BpiAccount): Promise<BpiAccount> {
    const newBpiAccountModel = await this.prisma.bpiAccount.update({
      where: { id: bpiAccount.id },
      data: {
        nonce: bpiAccount.nonce,
        stateTree: {
          update: { tree: MerkleTree.marshalTree(bpiAccount.stateTree.tree) },
        },
      },
    });

    return this.mapper.mapBpiAccountPrismaModelToDomainObject(
      newBpiAccountModel,
    );
  }

  async deleteBpiAccount(bpiAccount: BpiAccount): Promise<void> {
    await this.prisma.bpiAccount.delete({
      where: { id: bpiAccount.id },
    });
  }

  async storeAccompanyingStateLeafValues(
    id: string,
    leafValue: string,
    leafIndex: number,
    merkPayload: MerkleTree,
    witness: Witness,
  ): Promise<void> {
    await this.prisma.bpiAccountStateTreeLeafValue.create({
      data: {
        bpiAccountId: id,
        leafValue: leafValue,
        leafIndex: leafIndex,
        merkelizedPayload: MerkleTree.marshalTree(merkPayload),
        witness: JSON.stringify(witness),
      },
    });
  }

  async getAccompanyingStateLeafValues(
    leafValue: string,
  ): Promise<StateTreeLeafValueContent | undefined> {
    const stateLeafValues =
      await this.prisma.bpiAccountStateTreeLeafValue.findUnique({
        where: { leafValue: leafValue },
      });

    if (!stateLeafValues) {
      return undefined;
    }

    return this.mapper.mapBpiAccountStateTreeLeafValuePrismaModelToDomainObject(
      stateLeafValues,
    );
  }
}
