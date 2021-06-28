import dotenv from 'dotenv';
import axios from 'axios';
import { Wallet } from 'ethers';

import { logger } from '../logger';
import { InfuraGas } from './infura-gas';
import { EthClient } from './eth-client';
import { LocalDb } from './local-db';
import { http_provider, jsonrpc } from '../blockchain';

dotenv.config();

let txManager: ITxManager;
const wallet = new Wallet(process.env.WALLET_PRIVATE_KEY, http_provider);

export const get_tx_manager = async () => {
	if (!txManager) {
		try {
			txManager = await txManagerServiceFactory(process.env.ETH_CLIENT_TYPE);
		} catch (err) {
			logger.error(`Could not provision/find txManager for type: ${process.env.ETH_CLIENT_TYPE}`);
			txManager = undefined;
		}
	}
	return txManager;
};

const sleep = (ms: number) => {
	return new Promise((resolve) => setTimeout(resolve, ms));
};

export const waitTx = async (txHash: string, confirmsNeeded = 0) => {
	logger.debug(`Waiting for ${confirmsNeeded} block confirmations for txHash ${txHash}`);
	let mined = false;

	while (!mined) {
		const { result: txReceipt } = await jsonrpc('eth_getTransactionReceipt', [txHash]);
		if (txReceipt === null) {
			// Wait 1 sec then retry if tx is not queryable on-chain yet
			await sleep(1000);
			continue;
		}

		const { result: currentBlock } = await jsonrpc('eth_blockNumber', []);
		const confirms = currentBlock - txReceipt.blockNumber;
		if (txReceipt.blockNumber && confirms >= confirmsNeeded) {
			mined = true;
			logger.debug(`Success: txHash ${txHash} was mined`);
			return txReceipt;
		}
		await sleep(1000);
	}
};

export const keyManager_signTx = async (txObject: any, fromAddr: string) => {
	const res = await axios.post(`${process.env.KEY_MGR_URL}/ethereum/accounts/${fromAddr}/sign-transaction`, {
		to: txObject.to || '',
		chainId: txObject.chainId.toString() || process.env.CHAIN_ID.toString(),
		gasLimit: txObject.gasLimit,
		gasPrice: txObject.gasPrice.toString(),
		nonce: Number(txObject.nonce),
		amount: txObject.amount || '0',
		data: txObject.data
	});
	return res.data;
};

export const keyManager_signMessage = async (address: string, message: string) => {
	const res = await axios.post(`${process.env.KEY_MGR_URL}/ethereum/accounts/${address}/sign`, {
		data: message
	});
	return res.data;
};

export interface ITxManager {
	insertLeaf(
		toAddress: string,
		fromAddress: string,
		proof: any[],
		publicInputs: any[],
		newCommitment: string
	): Promise<any>;
}

export async function txManagerServiceFactory(provider: string): Promise<ITxManager> {
	let txManagerService: ITxManager;
	const signerType = process.env.SIGNING_SERVICE || 'ethers';
	let signingService;

	switch (provider) {
		case 'infura-gas':
			signingService = wallet;
			if (signerType === 'key-manager') {
				signingService.signMessage = keyManager_signMessage;
			}
			txManagerService = new InfuraGas(signingService, provider);
			break;
		case 'local-db':
			signingService = wallet;
			if (signerType === 'key-manager') {
				signingService.signTransaction = keyManager_signTx;
			}
			txManagerService = new LocalDb(signingService);
			break;
		default:
			signingService = wallet;
			if (signerType === 'key-manager') {
				signingService.signTransaction = keyManager_signTx;
			}
			txManagerService = new EthClient(signingService, provider);
	}

	logger.debug(`Creating TxManager of type ${provider} with signing service type ${signerType}`);
	return txManagerService;
}
