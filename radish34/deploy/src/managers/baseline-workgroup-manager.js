const assert = require('assert');
const ethers = require('ethers');

class WorkgroupManager {

	/*
	@dev pass ethers contracts instances
	*/
	constructor(orgRegistryContract, verifierContract, shieldContract, ) {
		assert(orgRegistryContract, "orgRegistryContract was not provided");
		assert(verifierContract, "verifierContract wallet was not provided");
		assert(shieldContract, "shieldContract wallet was not provided");
		this.orgRegistryContract = orgRegistryContract;
		this.verifierContract = verifierContract;
		this.shieldContract = shieldContract;
	}

	async registerOrganisation(organisationAddress, organisationName, organisationRole, organisationMessagingKey, organisationZkpPublicKey, transactionOverrides) {
		if (typeof transactionOverrides === 'undefined') {
			transactionOverrides = {}
		}

		const tx = await this.orgRegistryContract
			.registerOrg(
				organisationAddress,
				ethers.utils.formatBytes32String(organisationName),
				organisationRole,
				ethers.utils.hexlify(organisationMessagingKey),
				ethers.utils.hexlify(organisationZkpPublicKey),
				transactionOverrides
			)

		return tx.wait();
	}

	/**
	 * 
	 * @param {*} groupName The name of the registered interface group
	 * @param {*} tokenAddress The address of the payment token of the group
	 * @param {*} shieldAddress The address for the shield contract of the group
	 * @param {*} verifierAddress The address for the verifier contract of the group
	 */
	async registerOrganisationInterfaces(groupName, tokenAddress, shieldAddress, verifierAddress, transactionOverrides) {
		if (typeof transactionOverrides === 'undefined') {
			transactionOverrides = {}
		}

		const tx = await this.orgRegistryContract
			.registerInterfaces(
				ethers.utils.formatBytes32String(groupName),
				tokenAddress,
				shieldAddress,
				verifierAddress,
				transactionOverrides
			)

		return tx.wait();
	}

	async getOrganisationsCount() {
		return this.orgRegistryContract.getOrgCount();
	}

	async getOrganisationInfo(organisationAddress) {
		const result = await this.orgRegistryContract.getOrg(organisationAddress);
		const [address, name, role, messagingKey, zkpPublicKey] = result;
		return {
			address,
			name: ethers.utils.parseBytes32String(name),
			role: parseInt(role, 16),
			messagingKey,
			zkpPublicKey,
			toString: function () {
				return `
Organisation Address: ${this.address}
Organisation Name: ${this.name}
Organisation Role: ${this.role}
Organisation MessagingKey: ${this.messagingKey}
Organisation zkpPublicKey: ${this.zkpPublicKey}`
			}
		};
	}

	async registerVerificationKey(verificationKeyResolver, circuitName, transactionOverrides) {
		assert(verificationKeyResolver, 'No verification key resolver supplied');
		assert(circuitName, 'No circuit name supplied');

		if (typeof transactionOverrides === 'undefined') {
			transactionOverrides = {}
		}

		const {
			vkArray,
			actionType
		} = await verificationKeyResolver.resolveVerificationKey(circuitName);

		const tx = await this.shieldContract.registerVerificationKey(
			vkArray,
			actionType,
			transactionOverrides
		)

		return tx.wait();
	}
}

module.exports = WorkgroupManager