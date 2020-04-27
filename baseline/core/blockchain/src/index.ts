export interface BlockchainService {
  fetchTxReceipt(): Promise<any>;
  generateKeyPair(): Promise<any>;
  broadcast(tx: string): Promise<any>;
  sign(rawTx: string): Promise<any>;
}
