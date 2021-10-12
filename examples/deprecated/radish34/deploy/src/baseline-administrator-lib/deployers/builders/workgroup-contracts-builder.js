/**
 * Builder class for Workgroup contracts. Currently tailored to Radish34 usecase. To be abstracted further with the emergence of unified standard.
 */
class WorkgroupContractsBuilder {

	/**
	 * 
	 * @param {*} contractsResolver - the contract artifacts resolver that will be used to resolve the needed artifacts
	 */
	constructor(contractsResolver) {
		this.contractsResolver = contractsResolver;
	}

	/**
	 * Updates the task to include the creation of OrgRegistry too.
	 * 
	 * @param {*} erc1820RegistryAddress - address of  the ERC1820 address that will be needed to deploy the OrgRegistry contract.
	 */
	addOrgRegistry(erc1820RegistryAddress) {
		if (typeof erc1820RegistryAddress === 'undefined') {
			throw new Error('No erc1820Registry address supplied');
		}
		this.orgRegistryArtifacts = this.contractsResolver.resolve('OrgRegistry');
		this.orgRegistryArtifacts.erc1820RegistryAddress = erc1820RegistryAddress;
		return this;
	}

	/**
	 * Updates the task to include the creation of BN256G2, Verifier and Shield contracts (All depending on each other);
	 * 
	 * @param {*} erc1820RegistryAddress - address of  the ERC1820 address that will be needed to deploy the contracts.
	 */
	addShield(erc1820RegistryAddress) {
		if (typeof erc1820RegistryAddress === 'undefined') {
			throw new Error('No erc1820Registry address supplied');
		}
		this.BN256G2Artifacts = this.contractsResolver.resolve('BN256G2');
		this.verifierArtifacts = this.contractsResolver.resolve('Verifier');
		this.shieldArtifacts = this.contractsResolver.resolve('Shield');
		this.erc1820RegistryAddress = erc1820RegistryAddress;
		return this;
	}

	/**
	 * Builds the task object to be passed to the deployer class. Waits for all artifacts to be resolved before returning.
	 */
	async build() {
		return {
			orgRegistryArtifacts: await this.orgRegistryArtifacts,
			BN256G2Artifacts: await this.BN256G2Artifacts,
			verifierArtifacts: await this.verifierArtifacts,
			shieldArtifacts: await this.shieldArtifacts,
			erc1820RegistryAddress: this.erc1820RegistryAddress
		}
	}

}

module.exports = WorkgroupContractsBuilder