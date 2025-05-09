import { ethers } from 'ethers';
import solc from 'solc';
import dotenv from 'dotenv';
import axios from 'axios';
import shieldContract from './Shield.json';
import verifierNoopContract from './VerifierNoop.json';
import { logger } from '../../logger';
import { get_tx_manager, waitTx } from '../../tx-manager';

dotenv.config();

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

	// Deploy VerifierNoop by default
	let contractBytecode = verifierNoopContract.bytecode;
	if (bytecodeInput) {
		contractBytecode = bytecodeInput;
	}

	const txManager = await get_tx_manager();
	const { txHash } = await txManager.sendTransaction(
		undefined,
		process.env.WALLET_PUBLIC_KEY,
		contractBytecode
	);

	if (!txHash) {
		error = 'Deploy Verifier contract failed';
		return { error };
	}

	const txDetails = await waitTx(txHash);
	const verifierAddress = txDetails.contractAddress;
	logger.info(`SUCCESS! Verifier contract address is ${verifierAddress}`);

	return { result: verifierAddress };
};

export const deployShield = async (verifierAddress, treeHeight = 4) => {
	let error;

	// Encode the constructor parameters, then append to bytecode
	const abiCoder = new ethers.utils.AbiCoder();
	const encodedParams = abiCoder.encode(['address', 'uint'], [verifierAddress, treeHeight]);
	const bytecodeWithParams = shieldContract.bytecode + encodedParams.slice(2).toString();

	const txManager = await get_tx_manager();
	const { txHash } = await txManager.sendTransaction(
		undefined,
		process.env.WALLET_PUBLIC_KEY,
		bytecodeWithParams
	);

	if (!txHash) {
		error = 'Deploy Verifier contract failed';
		return { error };
	}

	const txDetails = await waitTx(txHash);
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
