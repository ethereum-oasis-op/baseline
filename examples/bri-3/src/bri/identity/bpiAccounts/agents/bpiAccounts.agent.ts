import { Injectable, NotFoundException } from '@nestjs/common';
import { v4 } from 'uuid';
import { BpiSubjectAccount } from '../../bpiSubjectAccounts/models/bpiSubjectAccount';

import { NOT_FOUND_ERR_MESSAGE } from '../api/err.messages';
import { BpiAccount } from '../models/bpiAccount';

import { BpiAccountStorageAgent } from './bpiAccountsStorage.agent';

// Agent methods have extremely declarative names and perform a single task
@Injectable()
export class BpiAccountAgent {
  constructor(private storageAgent: BpiAccountStorageAgent) {}

  public throwIfCreateBpiAccountInputInvalid() {
    return true;
  }

  public createNewBpiAccount(
    ownerBpiSubjectAccounts: BpiSubjectAccount[],
    authorizationCondition: string,
    stateObjectProverSystem: string,
    stateObjectStorage: string,
  ): BpiAccount {
    return new BpiAccount(
      v4(),
      ownerBpiSubjectAccounts,
      authorizationCondition,
      stateObjectProverSystem,
      stateObjectStorage,
    );
  }

  public async fetchUpdateCandidateAndThrowIfUpdateValidationFails(
    id: string,
  ): Promise<BpiAccount> {
    const bpiAccountToUpdate = await this.storageAgent.getAccountById(id);

    if (!bpiAccountToUpdate) {
      throw new NotFoundException(NOT_FOUND_ERR_MESSAGE);
    }

    return bpiAccountToUpdate;
  }

  public incrementAcountNonce(bpiAccountToUpdate: BpiAccount) {
    bpiAccountToUpdate.updateNonce();
  }

  public async fetchDeleteCandidateAndThrowIfDeleteValidationFails(
    id: string,
  ): Promise<BpiAccount> {
    const bpiAccountToDelete = await this.storageAgent.getAccountById(id);

    if (!bpiAccountToDelete) {
      throw new NotFoundException(NOT_FOUND_ERR_MESSAGE);
    }

    return bpiAccountToDelete;
  }
}
