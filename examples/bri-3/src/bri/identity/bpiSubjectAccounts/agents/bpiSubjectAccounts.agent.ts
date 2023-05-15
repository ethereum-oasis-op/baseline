import { Injectable, NotFoundException } from '@nestjs/common';
import { v4 } from 'uuid';

import { NOT_FOUND_ERR_MESSAGE } from '../api/err.messages';
import { NOT_FOUND_ERR_MESSAGE as SUBJECT_NOT_FOUND_ERR_MESSAGE } from '../../bpiSubjects/api/err.messages';
import { BpiSubjectAccountStorageAgent } from './bpiSubjectAccountsStorage.agent';
import { BpiSubjectAccount } from '../models/bpiSubjectAccount';
import { BpiSubject } from '../../bpiSubjects/models/bpiSubject';
import { BpiSubjectStorageAgent } from '../../bpiSubjects/agents/bpiSubjectsStorage.agent';

// Agent methods have extremely declarative names and perform a single task
@Injectable()
export class BpiSubjectAccountAgent {
  constructor(
    private subjectAccountStorageAgent: BpiSubjectAccountStorageAgent,
    private subjectStorageAgent: BpiSubjectStorageAgent,
  ) {}

  public async getBpiSubjectAccountsAndThrowIfNotExist(
    subjectAccountIds: string[],
  ) {
    const subjectAccounts: BpiSubjectAccount[] = [];

    for (const subjectAccountId of subjectAccountIds) {
      const subjectAccount =
        await this.subjectAccountStorageAgent.getBpiSubjectAccountById(
          subjectAccountId,
        );
      subjectAccounts.push(subjectAccount);
    }

    return subjectAccounts;
  }

  public async getCreatorAndOwnerSubjectsAndThrowIfNotExist(
    creatorBpiSubjectId: string,
    ownerBpiSubjectId: string,
  ) {
    const creatorBpiSubject = await this.subjectStorageAgent.getBpiSubjectById(
      creatorBpiSubjectId,
    );

    if (!creatorBpiSubject) {
      throw new NotFoundException(SUBJECT_NOT_FOUND_ERR_MESSAGE);
    }

    const ownerBpiSubject = await this.subjectStorageAgent.getBpiSubjectById(
      ownerBpiSubjectId,
    );

    if (!ownerBpiSubject) {
      throw new NotFoundException(SUBJECT_NOT_FOUND_ERR_MESSAGE);
    }

    return {
      creatorBpiSubject,
      ownerBpiSubject,
    };
  }

  public throwIfCreateBpiSubjectAccountInputInvalid() {
    // This is just an example, these fields will be validated on the DTO validation layer
    // This validation would check internal business rules (i.e. bpiSubject must have public key in the format defined by the participants..)
  }

  public createNewBpiSubjectAccount(
    creatorBpiSubject: BpiSubject,
    ownerBpiSubject: BpiSubject,
    authenticationPolicy: string,
    authorizationPolicy: string,
    verifiableCredential: string,
    recoveryKey: string,
  ): BpiSubjectAccount {
    return new BpiSubjectAccount(
      v4(),
      creatorBpiSubject,
      ownerBpiSubject,
      authenticationPolicy,
      authorizationPolicy,
      verifiableCredential,
      recoveryKey,
    );
  }

  public async fetchUpdateCandidateAndThrowIfUpdateValidationFails(
    id: string,
  ): Promise<BpiSubjectAccount> {
    const bpiSubjectAccountToUpdate =
      await this.subjectAccountStorageAgent.getBpiSubjectAccountById(id);

    if (!bpiSubjectAccountToUpdate) {
      throw new NotFoundException(NOT_FOUND_ERR_MESSAGE);
    }

    return bpiSubjectAccountToUpdate;
  }

  public updateBpiSubjectAccount() {
    return;
  }

  public async fetchDeleteCandidateAndThrowIfDeleteValidationFails(
    id: string,
  ): Promise<BpiSubjectAccount> {
    const bpiSubjectAccountToDelete =
      await this.subjectAccountStorageAgent.getBpiSubjectAccountById(id);

    if (!bpiSubjectAccountToDelete) {
      throw new NotFoundException(NOT_FOUND_ERR_MESSAGE);
    }

    return bpiSubjectAccountToDelete;
  }
}
