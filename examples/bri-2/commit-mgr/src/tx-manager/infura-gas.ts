import dotenv from "dotenv";
import { Wallet, ethers } from "ethers";
import { ITxManager } from '.';
import { logger } from '../logger';
import { http_provider, jsonrpc, shieldContract } from "../blockchain";

dotenv.config();

export class InfuraGas implements ITxManager {

  constructor(private readonly config: any) {
    this.config = config;
  }

  async signTx(toAddress: string, fromAddress: string, txData: string) {
    const wallet = new Wallet(process.env.WALLET_PRIVATE_KEY, http_provider);
    const nonce = await wallet.getTransactionCount();
    logger.debug(`nonce: ${nonce}`);

    const unsignedTx = {
      to: toAddress,
      from: fromAddress,
      data: txData,
      chainId: parseInt(process.env.CHAIN_ID, 10),
      gasLimit: 0,
      nonce
    };

    const gasEstimate = await wallet.estimateGas(unsignedTx);
    logger.debug(`gasEstimate: ${gasEstimate}`);
    const gasLimit = Math.ceil(Number(gasEstimate) * 1.1);
    logger.debug(`gasLimit set: ${gasLimit}`);

    const relayTransactionHash = ethers.utils.keccak256(
      ethers.utils.defaultAbiCoder.encode(
        ['address', 'bytes', 'uint', 'uint'],
        [toAddress, txData, gasLimit, process.env.CHAIN_ID] // Rinkeby chainId is 4
      )
    );

    const signature = await wallet.signMessage(ethers.utils.arrayify(relayTransactionHash))
    return { signature, gasLimit };
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
      const { signature, gasLimit } = await this.signTx(toAddress, fromAddress, txData);
      logger.debug(`Signature for relay: ${signature}`);
      logger.debug(`txData: ${txData}`);
      const transaction = {
        to: toAddress,
        data: txData,
        gas: `${gasLimit}`
      }
      const res = await jsonrpc('relay_sendTransaction', [transaction, signature]);
      logger.debug(`relay_sendTransaction response: %o`, res);
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


