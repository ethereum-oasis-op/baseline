const assert = require('assert');
const ethers = require('ethers');

class WorkgroupManager {

	/*
	@dev either pass an deployed instance.
	*/
	constructor(orgRegistryContract, verifierContract, shieldContract) {
		assert(orgRegistryContract, "orgRegistryContract was not provided");
		assert(verifierContract, "verifierContract wallet was not provided");
		assert(shieldContract, "shieldContract wallet was not provided");
		this.orgRegistryContract = orgRegistryContract;
		this.verifierContract = verifierContract;
		this.shieldContract = shieldContract;
	}

	setOrganisationResolver(organisationResolver) {
		this.organisationResolver = organisationResolver;
	}

	/**
	 * 
	 * @param {*} organisationName - the name of the organisation that is going to be resolved by the organisation resolver supplied via setOrganisationResolver
	 * @param {*} organisationAddress - the address of the organisation admin or interface implementers
	 * @param {*} organisationMessengerURI - the URI to the organisation messenger. Will be used by the organisation resolver to ask for the messenger key
	 */
	async registerOrganisation(organisationName, organisationAddress, organisationMessengerURI) {
		const organisation = await this.organisationResolver.resolve(organisationName, organisationMessengerURI);

		const tx = await this.orgRegistryContract
			.registerOrg(
				organisationAddress,
				ethers.utils.formatBytes32String(organisation.name),
				organisation.role,
				ethers.utils.hexlify(organisation.messagingKey),
				ethers.utils.hexlify(organisation.zkpPublicKey),
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
	async registerOrganisationInterfaces(groupName, tokenAddress, shieldAddress, verifierAddress) {
		const tx = await this.orgRegistryContract
			.registerInterfaces(
				ethers.utils.formatBytes32String(groupName),
				tokenAddress,
				shieldAddress,
				verifierAddress
			)

		return tx.wait();
	}
}

module.exports = WorkgroupManager