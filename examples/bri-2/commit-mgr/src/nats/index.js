import NATS from 'nats';
import axios from 'axios';
import { logger } from '../logger';
import { updateWorkflow } from './workflow-mgr';
import { compileContract, deployVerifier, deployShield } from '../blockchain/contracts';
import { trackShield } from '../route-handlers/rpc-methods';

let nc;

export const connectNATS = async () => {
	if (!nc) {
		try {
			nc = NATS.connect({ url: process.env.NATS_URL, json: true });
			nc.subscribe('contracts-compile-verifier', natsCompileVerifier);
			nc.subscribe('contracts-deploy-verifier', natsDeployVerifier);
			nc.subscribe('contracts-deploy-shield', natsDeployShield);
			logger.info(`Subscribed to all NATS topics`);
		} catch (err) {
			logger.error(`Could not connect to NATS: ${err.message}`);
			return;
		}
	}
	return nc;
};

const natsCompileVerifier = async (msg) => {
	logger.info(`NATS contracts-compile-verifier: received request for workflowId ${msg.WorkflowId}`);
	logger.info('message payload:' + JSON.stringify(msg, null, 4));

	// Retrieve Verifier.sol source code from zkp-mgr
	// NOTE: should we pass this in the NATS message (the URI) ??
	let res = await axios.get(`${process.env.ZKP_MGR_URL}/zkcircuits/${msg.ZkCircuitId}/verifier`);
	logger.info('GET /zkcircuits/{id}/verifier status code:' + res.status);

	// Compile Verifier.sol contract
	let verifierBytecode = await compileContract('Verifier', res.data);

	// TODO: Store compiled contract bytecode (through zkp-mgr?)
	// PUT zkcircuits/{id}
	// body: verifierBytecode

	// Update workflow status to "success-compile-verifier"
	await updateWorkflow(msg.WorkflowId, { status: 'success-compile-verifier' });

	// Create new contracts-deploy-verifier job
	logger.info(
		`NATS contracts-compile-verifier: completed job for ${msg.WorkflowId}. Creating new contracts-deploy-verifier job`
	);

	// NOTE: call an inservice method instead of external NATS call to improve efficiency
	nc.publish('contracts-deploy-verifier', {
		workflowId: msg.WorkflowId,
		zkCircuitId: msg.ZkCircuitId,
		verifierBytecode
	});
};

const natsDeployVerifier = async (msg) => {
	logger.info('NATS contracts-deploy-verifier: received request for workflowId ' + msg.workflowId);

	const { result: verifierAddress, error: errorVerifier } = await deployVerifier(msg.verifierBytecode);
	if (errorVerifier) {
		logger.error(`Error: problem deploying Verifier contract: ${errorVerifier.message}`);
		await updateWorkflow(msg.workflowId, { status: 'failed-deploy-verifier' });
		return;
	}

	// Update workflow status to "success-deploy-verifier"
	let updates = {
		status: 'success-deploy-verifier',
		verifierAddress
	};
	await updateWorkflow(msg.workflowId, updates);

	// Create new contracts-deploy-verifier job
	logger.info(
		`NATS contracts-deploy-verifier: completed job for ${msg.workflowId}. Creating new contracts-deploy-shield job`
	);

	// NOTE: call an inservice method instead of external NATS call to improve efficiency
	nc.publish('contracts-deploy-shield', {
		workflowId: msg.workflowId,
		verifierAddress
	});
};

const natsDeployShield = async (msg) => {
	logger.info('NATS contracts-deploy-shield: received request for workflowId ' + msg.workflowId);

	const { result: shieldAddress, error: errorShield } = await deployShield(msg.verifierAddress);
	if (errorShield) {
		logger.error(`Error: problem deploying Shield contract: ${errorShield.message}`);
		await updateWorkflow(msg.workflowId, { status: 'failed-deploy-shield' });
		return;
	}

	let updates = {
		status: 'success-deploy-shield',
		shieldAddress
	};
	await updateWorkflow(msg.workflowId, updates);

	logger.info('Setting up tracking for Shield contract...');
	const { result: trackResult, error: errorTrack } = await trackShield(shieldAddress);
	if (errorTrack) {
		logger.error(`Error: problem tracking Shield contract address ${shieldAddress}`);
		await updateWorkflow(msg.workflowId, { status: 'failed-track-shield' });
		return;
	}

	logger.info('Saving workflow status: ' + msg.workflowId);
	await updateWorkflow(msg.workflowId, { status: 'success-track-shield' });

	logger.info('SUCCESS: Setup complete for workflow ' + msg.workflowId);
	return;
};
