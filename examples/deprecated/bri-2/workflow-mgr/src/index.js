import dotenv from 'dotenv';
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { logger, reqLogger, reqErrorLogger } from './logger';
import { dbConnect } from './db';
import { connectNATS } from './nats';
import {
	getStatus,
	getOrganizations,
	createOrganization,
	deleteOrganization,
	getWorkflows,
	getWorkflow,
	createWorkflow,
	deleteWorkflow,
	updateWorkflow,
	deployContracts,
	inviteParticipants,
	acceptInvitation
} from './rest-routes';

const main = async () => {
	dotenv.config();
	const port = process.env.SERVER_PORT;

	logger.info('Starting workflow-mgr server...');
	const dbUrl = `mongodb://${process.env.DATABASE_USER}:${process.env.DATABASE_PASSWORD}@${process.env.DATABASE_HOST}/${process.env.DATABASE_NAME}`;

	logger.debug(`Attempting to connect to db: ${process.env.DATABASE_HOST}/${process.env.DATABASE_NAME}`);
	await dbConnect(dbUrl);
	await connectNATS();

	const app = express();
	app.use(reqLogger('WORKFLOW-MGR')); // Log requests
	app.use(reqErrorLogger('WORKFLOW-MGR')); // Log errors
	app.use(bodyParser.json({ limit: '2mb' })); // Pre-parse body content
	app.use(cors());

	app.get('/status', getStatus);
	app.get('/workflows', getWorkflows);
	app.get('/workflows/:workflowId', getWorkflow);
	app.post('/workflows', createWorkflow);
	app.put('/workflows/:workflowId', updateWorkflow);
	app.post('/workflows/:workflowId/deploy', deployContracts);
	app.post('/workflows/:workflowId/invite', inviteParticipants);
	app.post('/workflows/:workflowId/accept-invite', acceptInvitation);
	app.delete('/workflows/:workflowId', deleteWorkflow);
	app.get('/organizations', getOrganizations);
	app.post('/organizations', createOrganization);
	app.delete('/organizations/:orgId', deleteOrganization);

	app.listen(port, () => {
		logger.info(`REST server listening on port ${port}.`);
	});
};

main();
