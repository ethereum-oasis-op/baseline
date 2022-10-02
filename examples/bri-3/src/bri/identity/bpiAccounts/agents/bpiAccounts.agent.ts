import { Injectable, NotFoundException } from '@nestjs/common';
import { v4 } from 'uuid';

import { NOT_FOUND_ERR_MESSAGE } from '../api/err.messages';
import { BpiAccount } from '../models/bpiAccount';

import { BpiAccountStorageAgent } from './bpiAccountsStorage.agent';

// Agent methods have extremely declarative names and perform a single task
@Injectable()
export class BpiAccountAgent {
  constructor(private repo: BpiAccountStorageAgent) {}
  public throwIfCreateBpiAccountInputInvalid() {
    return true;
  }

  public createNewExternalBpiAccount(nonce: string): BpiAccount {
    return new BpiAccount(v4(), nonce, []);
  }

  public async fetchUpdateCandidateAndThrowIfUpdateValidationFails(
    id: string,
  ): Promise<BpiAccount> {
    const bpiAccountToUpdate = await this.repo.getAccountById(id);

    if (!bpiAccountToUpdate) {
      throw new NotFoundException(NOT_FOUND_ERR_MESSAGE);
    }

    return bpiAccountToUpdate;
  }

  public updateBpiAccount(bpiAccountToUpdate: BpiAccount, nonce: string) {
    bpiAccountToUpdate.updateNonce(nonce);
  }

  public async fetchDeleteCandidateAndThrowIfDeleteValidationFails(
    id: string,
  ): Promise<BpiAccount> {
    const bpiAccountToDelete = await this.repo.getAccountById(id);

    if (!bpiAccountToDelete) {
      throw new NotFoundException(NOT_FOUND_ERR_MESSAGE);
    }

    return bpiAccountToDelete;
  }
}
