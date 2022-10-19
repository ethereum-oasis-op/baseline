import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Proof } from '../models/proof';

import { NOT_FOUND_ERR_MESSAGE } from '../api/err.messages';
import { BpiAccount } from '../../identity/bpiAccounts/models/bpiAccount';

@Injectable()
export class ProofAgent {
  constructor(private storageAgent: TransactionStorageAgent) {}
  public throwIfCreateProofInputInvalid() {
    // TODO: This is a placeholder, we will add validation rules as we move forward with business logic implementation
    return true;
  }

  public createNewTransaction(
    id: string,
    nonce: number,
    workflowInstanceId: string,
    workstepInstanceId: string,
    from: BpiAccount,
    to: BpiAccount,
    payload: string,
    signature: string,
  ): Transaction {
    return new Transaction(
      id,
      nonce,
      workflowInstanceId,
      workstepInstanceId,
      from,
      to,
      payload,
      signature,
      TransactionStatus.Initialized,
    );
  }

  public async fetchUpdateCandidateAndThrowIfUpdateValidationFails(
    id: string,
  ): Promise<Transaction> {
    const transactionToUpdate = await this.storageAgent.getTransactionById(id);

    if (!transactionToUpdate) {
      throw new NotFoundException(NOT_FOUND_ERR_MESSAGE);
    }

    if (transactionToUpdate.status != TransactionStatus.Initialized) {
      throw new BadRequestException(UPDATE_WRONG_STATUS_ERR_MESSAGE);
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
    const transactionToDelete = await this.storageAgent.getTransactionById(id);

    if (!transactionToDelete) {
      throw new NotFoundException(NOT_FOUND_ERR_MESSAGE);
    }

    if (
      transactionToDelete.status == TransactionStatus.Processing ||
      transactionToDelete.status == TransactionStatus.Executed
    ) {
      throw new BadRequestException(DELETE_WRONG_STATUS_ERR_MESSAGE);
    }

    return transactionToDelete;
  }
}
