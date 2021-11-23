import { getOrganizations, createOrganization, deleteOrganization } from './organizations';
import {
	getWorkflows,
	getWorkflow,
	createWorkflow,
	updateWorkflow,
	deleteWorkflow,
	deployContracts,
	inviteParticipants,
	acceptInvitation
} from './workflows';

const getStatus = async (req, res) => {
	const result = {
		dbUrl: `${process.env.DATABASE_HOST}/${process.env.DATABASE_NAME}`,
		dbHost: process.env.DATABASE_HOST
	};
	res.status(200).send(result);
};

export {
	getStatus,
	getOrganizations,
	createOrganization,
	deleteOrganization,
	getWorkflow,
	getWorkflows,
	createWorkflow,
	updateWorkflow,
	deleteWorkflow,
	deployContracts,
	inviteParticipants,
	acceptInvitation
};
