import { ethers, Wallet } from 'ethers';
import { ITxManager, shieldContract } from '.';
import { logger } from '../logger';
import { http_provider, jsonrpc } from "../blockchain";

export class EthClient implements ITxManager {

  constructor(private readonly config: any) {
    this.config = config;
  }

  async signTx(toAddress: string, fromAddress: string, txData: any) {
    const unsignedTx = {
      to: toAddress,
      from: fromAddress,
      data: txData,
      chainId: parseInt(process.env.CHAIN_ID, 10),
      gasLimit: 0,
      nonce: 0
    };

    const wallet = new Wallet(process.env.WALLET_PRIVATE_KEY, http_provider);
    const nonce = await wallet.getTransactionCount();
    unsignedTx.nonce = nonce;
    logger.debug(`nonce: ${nonce}`);
    const gasEstimate = await wallet.estimateGas(unsignedTx);
    logger.debug(`gasEstimate: ${gasEstimate}`);
    unsignedTx.gasLimit = Math.ceil(Number(gasEstimate) * 1.1);
    logger.debug(`gasLimit set: ${unsignedTx.gasLimit}`);

    const signedTx = wallet.signTransaction(unsignedTx);
    return signedTx;
  }

  async insertLeaf(
    toAddress: string,
    fromAddress: string,
    proof: any[],
    publicInputs: any[],
    newCommitment: string
  ) {
    let error = null;
    let txHash: string;
    try {
      const shieldInterface = new ethers.utils.Interface(shieldContract.abi);
      const txData = shieldInterface.encodeFunctionData(
        "verifyAndPush(uint256[],uint256[],bytes32)",
        [proof, publicInputs, newCommitment]
      );
      const signedTx = await this.signTx(toAddress, fromAddress, txData);
      const res = await jsonrpc("eth_sendRawTransaction", [signedTx]);
      logger.debug('sendRawTransaction result:', res);
      txHash = res.result
    } catch (err) {
      logger.error('insertLeaf:', err);
      if (err.error) {
        error = { data: err.error.message }
      } else {
        error = { data: err };
      }
    }
    return { error, txHash };
  }
}
