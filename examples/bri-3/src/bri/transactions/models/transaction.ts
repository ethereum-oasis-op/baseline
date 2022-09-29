import { BpiAccount } from "../../identity/bpiAccounts/models/bpiAccount";
import { TransactionStatus } from "./transactionStatus.enum";

export class Transaction {
  private _transactionId: string;
  private _nonce: number;
  private _workflowInstanceId: string;
  private _workstepInstanceId: string;
  private _from: BpiAccount;
  private _to: BpiAccount;
  private _payload: string;
  private _signature: string;
  private _status: TransactionStatus;


  constructor(
    transactionId: string,
    nonce: number,
    workflowInstanceId: string,
    workstepInstanceId: string,
    from: BpiAccount,
    to: BpiAccount,
    payload: string,
    signature: string,
    status: TransactionStatus
  ) {
    this._transactionId = transactionId;
    this._nonce = nonce;
    this._workflowInstanceId = workflowInstanceId;
    this._workstepInstanceId = workstepInstanceId;
    this._from = from;
    this._to = to;
    this._payload = payload;
    this._signature = signature;
    this._status = status;
  }

  public get transactionId(): string {
    return this._transactionId;
  }

  public get nonce(): number {
    return this._nonce;
  }

  public get workflowInstanceId(): string {
    return this._workflowInstanceId;
  }

  public get workstepInstanceId(): string {
    return this._workstepInstanceId;
  }

  public get from(): BpiAccount {
    return this._from;
  }

  public get to(): BpiAccount {
    return this._to;
  }

  public get payload(): string {
    return this._payload;
  }

  public get signature(): string {
    return this._signature;
  }

  public get status(): TransactionStatus {
    return this._status;
  }
}
