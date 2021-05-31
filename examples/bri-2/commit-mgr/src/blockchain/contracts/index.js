import { ethers, Wallet } from 'ethers';
import solc from 'solc';
import dotenv from 'dotenv';
import axios from 'axios';
import shieldContract from './Shield.json';
import verifierNoopContract from './VerifierNoop.json';
import { logger } from '../../logger';

dotenv.config();

const senderAddress = process.env.WALLET_PUBLIC_KEY;
const web3provider = new ethers.providers.JsonRpcProvider(`${process.env.ETH_CLIENT_HTTP}`);
const wallet = new Wallet(process.env.WALLET_PRIVATE_KEY, web3provider);

export { shieldContract, verifierNoopContract };

export const compileContract = async (contractName, contractSourceCode) => {
	logger.info(`Received request to compile Solidity contract ${contractName}`);
	let input = {
		language: 'Solidity',
		sources: {
			'test.sol': {
				content: contractSourceCode
			}
		},
		settings: {
			outputSelection: {
				'*': {
					'*': ['*']
				}
			}
		}
	};

	let inputString = JSON.stringify(input);
	let output = await solc.compile(inputString);
	let outputJSON = await JSON.parse(output);
	let verifierBytecode = outputJSON.contracts['test.sol'][contractName].evm.bytecode.object;
	logger.info(`Successfully compiled Solidity contract ${contractName}`);
	return '0x' + verifierBytecode;
};

export const deployVerifier = async (bytecodeInput) => {
	let error;
	let res;
	let contractBytecode = verifierNoopContract.bytecode;

	if (bytecodeInput) {
		contractBytecode = bytecodeInput;
	}

	res = await axios.post(`${process.env.ETH_CLIENT_HTTP}`, {
		jsonrpc: '2.0',
		method: 'eth_getTransactionCount',
		params: [senderAddress, 'latest'],
		id: 1
	});

	const nonce = res.data.result;
	logger.info(`nonce: ${nonce}`);
	const unsignedTx = {
		from: senderAddress,
		data: contractBytecode,
		nonce
	};

	res = await axios.post(`${process.env.ETH_CLIENT_HTTP}`, {
		jsonrpc: '2.0',
		method: 'eth_estimateGas',
		params: [unsignedTx],
		id: 1
	});

	const gasEstimate = res.data.result;
	logger.info(`gasEstimate: ${gasEstimate}`);
	unsignedTx.gasLimit = Math.ceil(Number(gasEstimate) * 1.1);

	const tx = await wallet.sendTransaction(unsignedTx);
	await tx.wait();
	const txHash = tx.hash;
	if (!txHash) {
		error = 'Deploy Verifier contract failed';
		return { error };
	}

	res = await axios.post(`${process.env.ETH_CLIENT_HTTP}`, {
		jsonrpc: '2.0',
		method: 'eth_getTransactionReceipt',
		params: [txHash],
		id: 1
	});
	const txDetails = res.data.result;
	const verifierAddress = txDetails.contractAddress;
	logger.info(`SUCCESS! Verifier contract address is ${verifierAddress}`);

	return { result: verifierAddress };
};

export const deployShield = async (verifierAddress, treeHeight = 4) => {
	let error;
	const nonce = await wallet.getTransactionCount();
	const abiCoder = new ethers.utils.AbiCoder();
	// Encode the constructor parameters, then append to bytecode
	const encodedParams = abiCoder.encode(['address', 'uint'], [verifierAddress, treeHeight]);
	const bytecodeWithParams = shieldContract.bytecode + encodedParams.slice(2).toString();
	const unsignedTx = {
		from: senderAddress,
		data: bytecodeWithParams,
		nonce
	};

	const gasEstimate = await wallet.estimateGas(unsignedTx);
	logger.info(`gasEstimate: ${gasEstimate}`);
	unsignedTx.gasLimit = Math.ceil(Number(gasEstimate) * 1.1);

	const tx = await wallet.sendTransaction(unsignedTx);
	await tx.wait();
	const txHash = tx.hash;
	if (!txHash) {
		error = 'Deploy Verifier contract failed';
		return { error };
	}

	const res = await axios.post(`${process.env.ETH_CLIENT_HTTP}`, {
		jsonrpc: '2.0',
		method: 'eth_getTransactionReceipt',
		params: [txHash],
		id: 1
	});

	const txDetails = res.data.result;
	const shieldAddress = txDetails.contractAddress;
	logger.info(`SUCCESS! Shield contract address is ${shieldAddress}`);

	return { result: shieldAddress };
};

// TODO: call internal method instead of using http request to self
export const trackShield = async (shieldAddress) => {
	const res = await axios.post(`${process.env.COMMIT_MGR_URL}/jsonrpc`, {
		jsonrpc: '2.0',
		method: 'baseline_track',
		params: [shieldAddress],
		id: 1
	});
	const { result, error } = res.data.result;

	logger.info(`baseline_track request status: ${res.status}`);
	if (!error) {
		logger.info(`SUCCESS! Now tracking Shield contract address ${shieldAddress}`);
	}

	return { result, error };
};
