import { Injectable, NotFoundException } from '@nestjs/common';
import Mapper from '../../../utils/mapper';
import { v4 } from 'uuid';
import { NOT_FOUND_ERR_MESSAGE } from '../api/err.messages';
import { BpiAccount } from '../models/bpiAccount';
import { getType } from 'tst-reflect';

@Injectable()
export class MockBpiAccountsStorageAgent {
  constructor(private readonly mapper: Mapper) {}

  private bpiAccountsStore: BpiAccount[] = [];

  async getAccountById(id: string): Promise<BpiAccount> {
    const bpiAccount = this.bpiAccountsStore.find((bp) => bp.id === id);
    if (!bpiAccount) {
      throw new NotFoundException(NOT_FOUND_ERR_MESSAGE);
    }
    return this.mapper.map(bpiAccount, getType<BpiAccount>()) as BpiAccount;
  }

  async getAllBpiAccounts(): Promise<BpiAccount[]> {
    return Promise.resolve(
      this.bpiAccountsStore.map(
        (bpiAccount) =>
          this.mapper.map(bpiAccount, getType<BpiAccount>()) as BpiAccount,
      ),
    );
  }

  async createNewBpiAccount(bpiAccount: BpiAccount): Promise<BpiAccount> {
    const createdBp = this.mapper.map(
      new BpiAccount(v4(), bpiAccount.ownerBpiSubjectAccounts),
      getType<BpiAccount>(),
    ) as BpiAccount;

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
