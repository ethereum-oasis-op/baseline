import { Injectable, NotFoundException } from '@nestjs/common';
import Mapper from '../../../utils/mapper';
import { v4 } from 'uuid';
import { NOT_FOUND_ERR_MESSAGE } from '../api/err.messages';
import { BpiSubjectAccount } from '../models/bpiSubjectAccount';
import { getType } from 'tst-reflect';

@Injectable()
export class MockBpiSubjectAccountsStorageAgent {
  constructor(private readonly mapper: Mapper) {}

  private bpiSubjectAccountsStore: BpiSubjectAccount[] = [];

  async getSubjectAccountById(id: string): Promise<BpiSubjectAccount> {
    const bpiSubjectAccount = this.bpiSubjectAccountsStore.find(
      (bp) => bp.id === id,
    );
    if (!bpiSubjectAccount) {
      throw new NotFoundException(NOT_FOUND_ERR_MESSAGE);
    }
    return this.mapper.map(
      bpiSubjectAccount,
      getType<BpiSubjectAccount>(),
    ) as BpiSubjectAccount;
  }

  async getAllBpiSubjectAccounts(): Promise<BpiSubjectAccount[]> {
    return Promise.resolve(
      this.bpiSubjectAccountsStore.map(
        (bpiSubjectAccount) =>
          this.mapper.map(
            bpiSubjectAccount,
            getType<BpiSubjectAccount>(),
          ) as BpiSubjectAccount,
      ),
    );
  }

  async createNewBpiSubjectAccount(
    bpiSubjectAccount: BpiSubjectAccount,
  ): Promise<BpiSubjectAccount> {
    const createdBp = this.mapper.map(
      new BpiSubjectAccount(
        v4(),
        bpiSubjectAccount.creatorBpiSubject,
        bpiSubjectAccount.ownerBpiSubject,
      ),
      getType<BpiSubjectAccount>(),
    ) as BpiSubjectAccount;

    this.bpiSubjectAccountsStore.push(createdBp);
    return Promise.resolve(createdBp);
  }

  async updateBpiSubjectAccount(
    bpiSubjectAccount: BpiSubjectAccount,
  ): Promise<BpiSubjectAccount> {
    const bpToUpdate = this.bpiSubjectAccountsStore.find(
      (bp) => bp.id === bpiSubjectAccount.id,
    );
    Object.assign(bpToUpdate, BpiSubjectAccount) as BpiSubjectAccount;
    return Promise.resolve(bpToUpdate);
  }

  async deleteBpiSubjectAccount(
    bpiSubjectAccount: BpiSubjectAccount,
  ): Promise<void> {
    const bpToDeleteIndex = this.bpiSubjectAccountsStore.findIndex(
      (bp) => bp.id === bpiSubjectAccount.id,
    );
    this.bpiSubjectAccountsStore.splice(bpToDeleteIndex, 1);
  }
}
