import { Injectable, NotFoundException } from '@nestjs/common';
import { Transaction } from '../models/transaction';
import { TransactionStatus } from '../models/transactionStatus.enum';

import { NOT_FOUND_ERR_MESSAGE } from '../api/err.messages';
import { TransactionStorageAgent } from './transactionStorage.agent';
import { BpiAccount } from '../../identity/bpiAccounts/models/bpiAccount';

@Injectable()
export class TransactionAgent {
  constructor(private repo: TransactionStorageAgent) {}
  public throwIfCreateTransactionInputInvalid(name: string) {
    return true;
  }

  public createNewTransaction(
    transactionId: string,
    nonce: number,
    workflowInstanceId: string,
    workstepInstanceId: string,
    from: BpiAccount,
    to: BpiAccount,
    payload: string,
    signature: string,
    status: TransactionStatus,
  ): Transaction {
    return new Transaction(
      transactionId,
      nonce,
      workflowInstanceId,
      workstepInstanceId,
      from,
      to,
      payload,
      signature,
      status,
    );
  }

  public async fetchUpdateCandidateAndThrowIfUpdateValidationFails(
    id: string,
  ): Promise<Transaction> {
    const transactionToUpdate = await this.repo.getTransactionById(id);

    if (!transactionToUpdate) {
      throw new NotFoundException(NOT_FOUND_ERR_MESSAGE);
    }

    return transactionToUpdate;
  }

  public updateTransaction(
    transactionToUpdate: Transaction,
    payload: string,
    signature: string,
  ) {
    transactionToUpdate.updatePayload(payload, signature);
  }

  public async fetchDeleteCandidateAndThrowIfDeleteValidationFails(
    id: string,
  ): Promise<Transaction> {
    const transactionToDelete = await this.repo.getTransactionById(id);

    if (!transactionToDelete) {
      throw new NotFoundException(NOT_FOUND_ERR_MESSAGE);
    }

    return transactionToDelete;
  }
}
