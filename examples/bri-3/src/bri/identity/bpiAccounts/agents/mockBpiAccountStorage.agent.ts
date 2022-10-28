import { Injectable, NotFoundException } from '@nestjs/common';
import { v4 } from 'uuid';
import { NOT_FOUND_ERR_MESSAGE } from '../api/err.messages';
import { BpiAccount } from '../models/bpiAccount';

@Injectable()
export class MockBpiAccountsStorageAgent {
  private bpiAccountsStore: BpiAccount[] = [];

  async getAccountById(id: string): Promise<BpiAccount> {
    const bpiAccount = this.bpiAccountsStore.find((bp) => bp.id === id);
    if (!bpiAccount) {
      throw new NotFoundException(NOT_FOUND_ERR_MESSAGE);
    }
    return bpiAccount;
  }

  async getAllBpiAccounts(): Promise<BpiAccount[]> {
    return Promise.resolve(this.bpiAccountsStore);
  }

  async createNewBpiAccount(bpiAccount: BpiAccount): Promise<BpiAccount> {
    const createdBp = new BpiAccount(v4(), bpiAccount.ownerBpiSubjectAccounts);

    this.bpiAccountsStore.push(createdBp);
    return Promise.resolve(createdBp);
  }

  async updateBpiAccount(bpiSubject: BpiAccount): Promise<BpiAccount> {
    const bpToUpdate = this.bpiAccountsStore.find(
      (bp) => bp.id === bpiSubject.id,
    );
    Object.assign(bpToUpdate, BpiAccount) as BpiAccount;
    return Promise.resolve(bpToUpdate);
  }

  async deleteBpiAccount(bpiSubject: BpiAccount): Promise<void> {
    const bpToDeleteIndex = this.bpiAccountsStore.findIndex(
      (bp) => bp.id === bpiSubject.id,
    );
    this.bpiAccountsStore.splice(bpToDeleteIndex, 1);
  }
}
