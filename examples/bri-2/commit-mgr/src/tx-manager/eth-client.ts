import { ethers, Wallet } from 'ethers';
import { ITxManager } from '.';
import { logger } from '../logger';
import { http_provider, jsonrpc, shieldContract } from "../blockchain";

export class EthClient implements ITxManager {

  constructor(private readonly config: any) {
    this.config = config;
  }

  async signTx(toAddress: string, fromAddress: string, txData: any) {
    const wallet = new Wallet(process.env.WALLET_PRIVATE_KEY, http_provider);
    const nonce = await wallet.getTransactionCount();
    logger.debug(`nonce: ${nonce}`);
    const gasPrice = await wallet.getGasPrice();
    logger.debug(`gasPrice found: ${gasPrice}`);
    const gasPriceSet = Math.ceil(Number(gasPrice) * 1.2);
    logger.debug(`gasPrice set: ${gasPriceSet}`);

    const unsignedTx = {
      to: toAddress,
      from: fromAddress,
      data: txData,
      nonce,
      chainId: parseInt(process.env.CHAIN_ID, 10),
      gasLimit: 0,
      gasPrice: gasPriceSet
    };

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
      logger.debug(`signedTx: ${signedTx}`);
      const res = await jsonrpc("eth_sendRawTransaction", [signedTx]);
      logger.debug('eth_sendRawTransaction result:', res);
      txHash = res.result
    } catch (err) {
      logger.error('[baseline_verifyAndPush]:', err);
      if (err.error) {
        error = { data: err.error.message }
      } else {
        error = { data: err };
      }
    }
    return { error, txHash };
  }
}
