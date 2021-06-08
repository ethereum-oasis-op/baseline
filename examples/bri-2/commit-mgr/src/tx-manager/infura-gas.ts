import dotenv from 'dotenv';
import { ethers } from 'ethers';
import { ITxManager } from '.';
import { logger } from '../logger';
import { http_provider, jsonrpc, shieldContract } from '../blockchain';

dotenv.config();

export class InfuraGas implements ITxManager {
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

		const unsignedTx = {
			to: toAddress || '',
			from: fromAddress,
			data: txData,
			nonce,
			chainId: parseInt(process.env.CHAIN_ID, 10),
			gasLimit: 0
		};

		// key-manager returns 400 if "from" field is provided in tx
		if (this.signerType === 'key-manager') {
			delete unsignedTx.from;
		}

		const res = await jsonrpc('eth_estimateGas', [unsignedTx]);
		const gasEstimate = res.result;
		logger.debug(`gasEstimate: ${gasEstimate}`);
		const gasLimit = Math.ceil(Number(gasEstimate) * 1.1);
		logger.debug(`gasLimit set: ${gasLimit}`);

		const relayTransactionHash = ethers.utils.keccak256(
			ethers.utils.defaultAbiCoder.encode(
				['address', 'bytes', 'uint', 'uint'],
				[toAddress, txData, gasLimit, process.env.CHAIN_ID] // Rinkeby chainId is 4
			)
		);

		logger.debug('Unsigned tx: ' + JSON.stringify(unsignedTx, null, 4));
		const signature = await this.signer.signMessage(ethers.utils.arrayify(relayTransactionHash));
		logger.debug(`Message signature: ${signature}`);
		return { signature, gasLimit };
	}

	async sendTransaction(toAddress: string, fromAddress: string, txData: string) {
		logger.debug('Received request for EthClient.sendTransaction');
		let error = null;
		let txHash: string;
		try {
			const signedTx = await this.constructTx(toAddress, fromAddress, txData);

			// TODO: SAS pick up here
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
			const { signature, gasLimit } = await this.constructTx(toAddress, fromAddress, txData);
			logger.debug(`Signature for relay: ${signature}`);
			logger.debug(`txData: ${txData}`);
			const transaction = {
				to: toAddress,
				data: txData,
				gas: `${gasLimit}`
			};
			const res = await jsonrpc('relay_sendTransaction', [transaction, signature]);
			logger.debug(`relay_sendTransaction response: %o`, res);
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
