import { InfuraGas } from './infura-gas';
import { EthClient } from './eth-client';
import { LocalDb } from './local-db';
import { logger } from '../logger';
import dotenv from 'dotenv';
import { jsonrpc } from '../blockchain';

dotenv.config();

let txManager;

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

const sleep = (ms) => {
	return new Promise((resolve) => setTimeout(resolve, ms));
};

export const waitTx = async (txHash: string, confirmsNeeded = 0) => {
	logger.debug(`Waiting for ${confirmsNeeded} block confirmations for txHash ${txHash}`);
	let mined = false;

	while (!mined) {
		const { result: txReceipt } = await jsonrpc('eth_getTransactionReceipt', [txHash]);
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

export interface ITxManager {
	insertLeaf(
		toAddress: string,
		fromAddress: string,
		proof: any[],
		publicInputs: any[],
		newCommitment: string
	): Promise<any>;
}

export async function txManagerServiceFactory(provider: string, config?: any): Promise<ITxManager> {
	let service;

	switch (provider) {
		case 'infura-gas':
			service = new InfuraGas(config);
			break;
		case 'infura':
			service = new EthClient(config);
			break;
		case 'besu':
			service = new EthClient(config);
			break;
		case 'ganache':
			service = new EthClient(config);
			break;
		case 'local-db':
			service = new LocalDb(config);
			break;
		default:
			throw new Error('TxManager provider not found.');
	}

	return service;
}
