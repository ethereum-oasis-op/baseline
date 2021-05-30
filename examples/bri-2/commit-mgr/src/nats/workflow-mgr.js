import axios from 'axios';
import { logger } from '../logger';

export const updateWorkflow = async (workflowId, updates) => {
	let error;
	let { status, zkCircuitId, verifierAddress, shieldAddress } = updates;
	let putBody = {
		status,
		zkCircuitId,
		verifierAddress,
		shieldAddress
	};

	//if (zkCircuitId) {
	//putBody.zkCircuitId = zkCircuitId;
	//}

	//if (verifierAddress) {
	//putBody.zkCircuitId = zkCircuitId;
	//}

	let res = await axios.put(`${process.env.WORKFLOW_MGR_URL}/workflows/${workflowId}`, putBody);
	if (res.status < 200 || res.status > 299) {
		error = `Error updating workflow: PUT /workflows returned status code${res.status}`;
		logger.error(error);
		return { error };
	}

	return { result: res.status };
};
