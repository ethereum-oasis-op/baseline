import { ethers } from 'ethers';
import { ITxManager } from '.';
import { logger } from '../logger';
import { jsonrpc, shieldContract } from '../blockchain';

export class EthClient implements ITxManager {
	constructor(public signer: any, public signerType: string) {
		this.signerType = signerType;
		this.signer = signer;
	}

	async constructTx(toAddress: string, fromAddress: string, txData: string) {
		logger.debug('Received request for EthClient.signTx');
		const { result: nonce } = await jsonrpc('eth_getTransactionCount', [
			process.env.WALLET_PUBLIC_KEY,
			'latest'
		]);
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
			gasPrice: '0x' + gasPriceSet.toString(16)
		};

		// key-manager returns 400 if "from" field is provided in tx
		if (this.signerType === 'key-manager') {
			delete unsignedTx.from;
		}

		const res = await jsonrpc('eth_estimateGas', [unsignedTx]);
		const gasEstimate = res.result;
		logger.debug(`gasEstimate: ${gasEstimate}`);
		if (!gasEstimate) {
			return {
				error: {
					code: -32000,
					message: `eth_estimateGas returned null value`
				}
			};
		}
		unsignedTx.gasLimit = Math.ceil(Number(gasEstimate) * 1.1);
		logger.debug(`gasLimit set: ${unsignedTx.gasLimit}`);

		logger.debug('Unsigned tx: ' + JSON.stringify(unsignedTx, null, 4));
		const signedTx = await this.signer.signTransaction(unsignedTx, fromAddress);
		logger.debug(`Signed tx: ${signedTx}`);
		return { result: signedTx };
	}

	async sendTransaction(toAddress: string, fromAddress: string, txData: string) {
		logger.debug('Received request for EthClient.sendTransaction');
		let error = null;
		let txHash: string;
		try {
			const { error: constructError, result: signedTx } = await this.constructTx(
				toAddress,
				fromAddress,
				txData
			);
			if (constructError) {
				return { error: constructError };
			}
			const res = await jsonrpc('eth_sendRawTransaction', [signedTx]);
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
			const { error: constructError, result: signedTx } = await this.constructTx(
				toAddress,
				fromAddress,
				txData
			);
			if (constructError) {
				return { error: constructError };
			}
			const res = await jsonrpc('eth_sendRawTransaction', [signedTx]);
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
