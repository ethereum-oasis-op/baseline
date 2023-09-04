import { Mapper } from '@automapper/core';
import { InjectMapper } from '@automapper/nestjs';
import { Injectable, NotFoundException } from '@nestjs/common';
import MerkleTree from 'merkletreejs';
import { PrismaService } from '../../../../../prisma/prisma.service';
import { Witness } from '../../../zeroKnowledgeProof/models/witness';
import { NOT_FOUND_ERR_MESSAGE } from '../api/err.messages';
import { BpiAccount } from '../models/bpiAccount';
import { StateLeafValues } from '../../../state/models/stateLeafValues';

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

  async storeNewBpiAccount(bpiAccount: BpiAccount): Promise<BpiAccount> {
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
      },
    });

    return this.mapper.map(newBpiAccountModel, BpiAccount, BpiAccount);
  }

  async updateBpiAccount(bpiAccount: BpiAccount): Promise<BpiAccount> {
    const newBpiAccountModel = await this.bpiAccount.update({
      where: { id: bpiAccount.id },
      data: {
        nonce: bpiAccount.nonce,
        stateTree: {
          update: { tree: MerkleTree.marshalTree(bpiAccount.stateTree.tree) },
        },
      },
    });

    return this.mapper.map(newBpiAccountModel, BpiAccount, BpiAccount);
  }

  async deleteBpiAccount(bpiAccount: BpiAccount): Promise<void> {
    await this.bpiAccount.delete({
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
    await this.bpiAccountStateTreeLeafValue.create({
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
  ): Promise<StateLeafValues | undefined> {
    const stateLeafValues = await this.bpiAccountStateTreeLeafValue.findUnique({
      where: { leafValue: leafValue },
    });

    if (!stateLeafValues) {
      return undefined;
    }

    return this.mapper.map(stateLeafValues, StateLeafValues, StateLeafValues);
  }
}
