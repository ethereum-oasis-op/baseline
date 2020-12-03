import dotenv from "dotenv";
import { Wallet, ethers } from "ethers";
import { ITxManager, shieldContract } from '.';
import { logger } from '../logger';
import { jsonrpc } from "../blockchain";

dotenv.config();

export class InfuraGas implements ITxManager {

  constructor(private readonly config: any) {
    this.config = config;
  }

  async signTx(
    toAddress: string,
    txData: string,
  ) {

    const wallet = new Wallet(process.env.WALLET_PRIVATE_KEY);
    const relayObject = {
      to: toAddress,
      data: txData,
      gas: "0xFFFFFFFF",
      chainId: process.env.CHAIN_ID
    }
    const rlpEncoded = ethers.utils.RLP.encode(relayObject);
    const hash = ethers.utils.keccak256("\x19Ethereum Signed Message:\n" + rlpEncoded.length + rlpEncoded);

    const signedMessage = await wallet.signMessage(hash);
    return signedMessage;
  }

  async insertLeaf(
    toAddress: string,
    fromAddress: string,
    proof: any[],
    publicInputs: any[],
    newCommitment: string
  ) {

    const shieldInterface = new ethers.utils.Interface(shieldContract.abi);
    const txData = shieldInterface.encodeFunctionData(
      "verifyAndPush(uint256[],uint256[],bytes32)",
      [proof, publicInputs, newCommitment]
    );

    const signedMessage = await this.signTx(toAddress, txData);
    logger.debug(`Signed message: ${signedMessage}`);
    const transaction = {
      to: toAddress,
      data: txData,
      // Private-beta needs gas field?
      // gas: gas
    }

    const res = await jsonrpc('relay_sendTransaction', [transaction, signedMessage]); // Private-beta
    return res;
  }

}


