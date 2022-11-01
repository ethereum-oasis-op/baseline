import { Injectable, NotFoundException } from '@nestjs/common';
import { v4 } from 'uuid';
import { NOT_FOUND_ERR_MESSAGE } from '../api/err.messages';
import { BpiSubjectAccount } from '../models/bpiSubjectAccount';

@Injectable()
export class MockBpiSubjectAccountsStorageAgent {
  private bpiSubjectAccountsStore: BpiSubjectAccount[] = [];

  async getBpiSubjectAccountById(id: string): Promise<BpiSubjectAccount> {
    const bpiSubjectAccount = this.bpiSubjectAccountsStore.find(
      (bp) => bp.id === id,
    );
    if (!bpiSubjectAccount) {
      throw new NotFoundException(NOT_FOUND_ERR_MESSAGE);
    }
    return bpiSubjectAccount;
  }

  async getAllBpiSubjectAccounts(): Promise<BpiSubjectAccount[]> {
    return Promise.resolve(this.bpiSubjectAccountsStore);
  }

  async createNewBpiSubjectAccount(
    bpiSubjectAccount: BpiSubjectAccount,
  ): Promise<BpiSubjectAccount> {
    const createdBp = new BpiSubjectAccount(
      v4(),
      bpiSubjectAccount.creatorBpiSubject,
      bpiSubjectAccount.ownerBpiSubject,
    );

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
