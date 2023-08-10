import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Transaction } from '../models/transaction';
import { TransactionStatus } from '../models/transactionStatus.enum';

import { Workstep } from '@prisma/client';
import { AuthAgent } from '../../auth/agent/auth.agent';
import { BpiSubjectAccount } from '../../identity/bpiSubjectAccounts/models/bpiSubjectAccount';
import { WorkflowStorageAgent } from '../../workgroup/workflows/agents/workflowsStorage.agent';
import { WorkstepStorageAgent } from '../../workgroup/worksteps/agents/workstepsStorage.agent';
import {
  DELETE_WRONG_STATUS_ERR_MESSAGE,
  NOT_FOUND_ERR_MESSAGE,
  UPDATE_WRONG_STATUS_ERR_MESSAGE,
} from '../api/err.messages';
import { TransactionStorageAgent } from './transactionStorage.agent';

@Injectable()
export class TransactionAgent {
  constructor(
    private txStorageAgent: TransactionStorageAgent,
    private workstepStorageAgent: WorkstepStorageAgent,
    private workflowStorageAgent: WorkflowStorageAgent,
    private authAgent: AuthAgent,
  ) {}

  public throwIfCreateTransactionInputInvalid() {
    // TODO: This is a placeholder, we will add validation rules as we move forward with business logic implementation
    return true;
  }

  public isCreateTransactionInputInvalid(): boolean {
    // TODO: This is a placeholder, we will add validation rules as we move forward with business logic implementation
    return true;
  }

  public createNewTransaction(
    id: string,
    nonce: number,
    workflowInstanceId: string,
    workstepInstanceId: string,
    fromBpiSubjectAccount: BpiSubjectAccount,
    toBpiSubjectAccount: BpiSubjectAccount,
    payload: string,
    signature: string,
  ): Transaction {
    return new Transaction(
      id,
      nonce,
      workflowInstanceId,
      workstepInstanceId,
      fromBpiSubjectAccount,
      toBpiSubjectAccount,
      payload,
      signature,
      TransactionStatus.Initialized,
    );
  }

  public async fetchUpdateCandidateAndThrowIfUpdateValidationFails(
    id: string,
  ): Promise<Transaction> {
    const transactionToUpdate = await this.txStorageAgent.getTransactionById(
      id,
    );

    if (!transactionToUpdate) {
      throw new NotFoundException(NOT_FOUND_ERR_MESSAGE);
    }

    if (transactionToUpdate.status !== TransactionStatus.Initialized) {
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

  public updateTransactionStatusToProcessing(
    transactionsToUpdate: Transaction,
  ) {
    transactionsToUpdate.updateStatusToProcessing();
  }

  public async fetchDeleteCandidateAndThrowIfDeleteValidationFails(
    id: string,
  ): Promise<Transaction> {
    const transactionToDelete = await this.txStorageAgent.getTransactionById(
      id,
    );

    if (!transactionToDelete) {
      throw new NotFoundException(NOT_FOUND_ERR_MESSAGE);
    }

    if (
      transactionToDelete.status === TransactionStatus.Processing ||
      transactionToDelete.status === TransactionStatus.Executed
    ) {
      throw new BadRequestException(DELETE_WRONG_STATUS_ERR_MESSAGE);
    }

    return transactionToDelete;
  }

  public async validateTransactionForExecution(
    tx: Transaction,
  ): Promise<boolean> {
    // TODO: Log each validation err for now
    const workflow = await this.workflowStorageAgent.getWorkflowById(
      tx.workflowInstanceId,
    );

    if (!workflow) {
      return false;
    }

    const workstep = await this.workstepStorageAgent.getWorkstepById(
      tx.workstepInstanceId,
    );

    if (!workstep) {
      return false;
    }

    if (!tx.fromBpiSubjectAccount) {
      return false;
    }

    if (!tx.toBpiSubjectAccount) {
      return false;
    }

    if (tx.nonce !== workflow.bpiAccount.nonce + 1) {
      return false;
    }

    const isSignatureValid = this.authAgent.verifySignatureAgainstPublicKey(
      tx.payload,
      tx.signature,
      tx.fromBpiSubjectAccount.ownerBpiSubject.publicKey,
    );

    if (!isSignatureValid) {
      return false;
    }

    if (tx.status !== TransactionStatus.Processing) {
      return false;
    }

    return true;
  }

  public async executeTransaction(
    tx: Transaction,
    workstep: Workstep,
  ): Promise<boolean> {
    // TODO: #698 Merkelize transaction payload
    // TODO: #701 Fetch circuit attached to the workstep
    // TODO: #701 Prepare circuit inputs and execute
    // TODO: #701 Return merkelized payload and witness
    return true;
  }
}
