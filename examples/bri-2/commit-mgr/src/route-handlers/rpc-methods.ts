import dotenv from 'dotenv';
import { merkleTrees } from '../db/models/MerkleTree';
import { logger } from '../logger';
import { txManagerServiceFactory } from '../tx-manager';
import { rpcServer } from '../rpc-server';
import { checkChainLogs, subscribeMerkleEvents, jsonrpc } from '../blockchain';

// configs loaded
dotenv.config();

export const jsonRpcHandler = async (req: any, res: any) => {
	const context = {
		headers: req.headers,
		params: req.params,
		body: req.body,
		ipAddress: req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.socket.remoteAddress
	};

	rpcServer.call(req.body, context, (err: any, result: any) => {
		if (err) {
			const errorMessage = err.error.data
				? `${err.error.message}: ${err.error.data}`
				: `${err.error.message}`;
			logger.error(`Response error: ${errorMessage}`);
			res.send(err);
			return;
		}
		res.send(result || {});
	});
};

export const verifyAndPush = async (
	senderAddress: string,
	treeId: string,
	proof,
	publicInputs,
	newCommitment: string
) => {
	let error;
	let result;

	const record = await merkleTrees
		.findOne({ _id: `${treeId}_0` })
		.select('shieldContract')
		.lean();
	if (!record) {
		logger.error(`[baseline_verifyAndPush] Merkle Tree not found in db: ${treeId}`);
		error = {
			code: -32603,
			message: `Internal server error`,
			data: `Merkle Tree not found in db: ${treeId}`
		};
		return { error, undefined };
	}
	logger.info(`[baseline_verifyAndPush] Found Merkle Tree for tree ID: ${treeId}`);

	const txManager = await txManagerServiceFactory(process.env.ETH_CLIENT_TYPE);

	try {
		result = await txManager.insertLeaf(treeId, senderAddress, proof, publicInputs, newCommitment);
	} catch (err) {
		logger.error(`[baseline_verifyAndPush] ${err}`);
		error = {
			code: -32603,
			message: `Internal server error`
		};
		return { error, undefined };
	}
	logger.info(`[baseline_verifyAndPush] txHash: ${result.txHash}`);
	return result;
};

export const trackShield = async (contractAddress: string) => {
	let error: any;

	// First check to see if we're already tracking this MerkleTree
	const merkleTree = await merkleTrees.findOne({ _id: `${contractAddress}_0` });
	if (merkleTree && merkleTree.active === true) {
		logger.info(`[baseline_track] already tracking merkletree at address ${contractAddress}`);
		return { result: true };
	}

	const methodSignature = '0x01e3e915'; // function selector for "treeHeight()"
	const res = await jsonrpc('eth_call', [
		{
			to: contractAddress,
			data: methodSignature
		},
		'latest'
	]);
	if (res.error) {
		return { error: res.error, result: res.result };
	}
	const treeHeight = Number(res.result);
	if (!treeHeight) {
		error = {
			code: -32603,
			message: `Internal server error`,
			data: `Could not retreive treeHeight from blockchain`
		};
		return { error };
	}
	logger.info(`[baseline_track] found treeHeight of ${treeHeight} for contract ${contractAddress}`);

	await merkleTrees.findOneAndUpdate(
		{ _id: `${contractAddress}_0` },
		{
			_id: `${contractAddress}_0`,
			treeHeight,
			active: true
		},
		{ upsert: true, new: true, setDefaultsOnInsert: true }
	);

	await checkChainLogs(contractAddress, 0);
	error = subscribeMerkleEvents(contractAddress);
	return { error, result: true };
};
