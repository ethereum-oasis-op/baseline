import { Schema, model } from 'mongoose';

const workflowSchema = new Schema({
	_id: String,
	description: String,
	clientType: String, // [user input] What app created this workflow? (dashboard-test, excel, google-sheets, sap, d365, etc.)
	chainId: String, // [user input] Which blockchain network are smart contracts deployed to?
	hashDataStructure: String, // [user input] hash-chain vs. merkle-tree
	shieldAddress: String, // [auto-gen] Shield contract address where hashes are stored on-chain
	verifierAddress: String, // [auto-gen] Verifier contract address
	zkCircuitId: String, // uuid of zkCircuit stored in zkp-mgr
	participants: [
		{
			orgId: String, // uuids of orgs we are baselining with
			publicKey: String, // uuids of orgs we are baselining with
			description: String,
			status: String // created vs. invited vs. accepted
		}
	],
	creator: String, // uuid of org that sent invitations
	lastCommitId: String, // uuid of last commit stored on-chain
	pendingCommitId: String, // uuid of commit waiting for signatures

	/***********************************************************/
	/********      Possible "status" values            *********
     
     [new-workflow-allocation]
     [success-circuit-compile]  || [fail-circuit-compile]
     [success-circuit-setup]    || [fail-circuit-setup]
     [success-compile-verifier] || [fail-compile-verifier]
     [success-deploy-verifier]  || [fail-deploy-verifier]
     [success-deploy-shield]    || [fail-deploy-shield]
     [success-track-shield]     || [fail-track-shield]
     [invited] some workflow invitations are still pending
     [active] all participants have accepted invitations
     [completed] workflow exit has been executed

  ************************************************************/
	status: String
});

// Automatically generate createdAt and updatedAt fields
workflowSchema.set('timestamps', true);

export const workflows = model('workflows', workflowSchema);
