import { ethers, Wallet } from 'ethers';
import { ITxManager } from '.';
import { logger } from '../logger';
import { http_provider, jsonrpc, shieldContract } from '../blockchain';

export class EthClient implements ITxManager {
	constructor(private readonly config: any) {
		this.config = config;
	}

	async signTx(toAddress: string, fromAddress: string, txData: any) {
		logger.debug('Received request for EthClient.signTx');
		const wallet = new Wallet(process.env.WALLET_PRIVATE_KEY, http_provider);
		const { result: nonce } = await jsonrpc('eth_getTransactionCount', [process.env.WALLET_PUBLIC_KEY]);
		logger.debug(`nonce: ${nonce}`);
		const { result: gasPrice } = await jsonrpc('eth_gasPrice', []);
		logger.debug(`gasPrice found: ${gasPrice}`);
		const gasPriceSet = Math.ceil(Number(gasPrice) * 1.2);
		logger.debug(`gasPrice set: ${gasPriceSet}`);

		const unsignedTx = {
			to: toAddress || '',
			from: fromAddress,
			data: txData,
			nonce,
			chainId: parseInt(process.env.CHAIN_ID, 10),
			gasLimit: 0,
			gasPrice: gasPriceSet
		};

		const res = await jsonrpc('eth_estimateGas', [unsignedTx]);
		const gasEstimate = res.result;
		logger.debug(`gasEstimate: ${gasEstimate}`);
		unsignedTx.gasLimit = Math.ceil(Number(gasEstimate) * 1.1);
		logger.debug(`gasLimit set: ${unsignedTx.gasLimit}`);

		// TODO: use key-manager service to perform this signature
		const signedTx = wallet.signTransaction(unsignedTx);
		return signedTx;
	}

	async sendTransaction(toAddress: string, fromAddress: string, txData: string) {
		logger.debug('Received request for EthClient.sendTransaction');
		let error = null;
		let txHash: string;
		try {
			const signedTx = await this.signTx(toAddress, fromAddress, txData);
			const res = await jsonrpc('eth_sendRawTransaction', [signedTx]);
			logger.debug('eth_sendRawTransaction result:', res);
			txHash = res.result;
		} catch (err) {
			logger.error('EthClient.sendTransaction:', err);
			if (err.error) {
				error = { data: err.error.message };
			} else {
				error = { data: err };
			}
		}
		return { error, txHash };
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
			const txData = shieldInterface.encodeFunctionData('verifyAndPush(uint256[],uint256[],bytes32)', [
				proof,
				publicInputs,
				newCommitment
			]);
			const signedTx = await this.signTx(toAddress, fromAddress, txData);
			logger.debug(`signedTx: ${signedTx}`);
			const res = await jsonrpc('eth_sendRawTransaction', [signedTx]);
			logger.debug('eth_sendRawTransaction result:', res);
			txHash = res.result;
		} catch (err) {
			logger.error('[baseline_verifyAndPush]:', err);
			if (err.error) {
				error = { data: err.error.message };
			} else {
				error = { data: err };
			}
		}
		return { error, txHash };
	}
}
