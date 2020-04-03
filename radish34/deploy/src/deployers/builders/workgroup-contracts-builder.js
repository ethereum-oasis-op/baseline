class WorkgroupContractsBuilder {
	constructor(contractsResolver) {
		this.contractsResolver = contractsResolver;
	}

	addOrgRegistry(erc1820RegistryAddress) {
		if (typeof erc1820RegistryAddress === 'undefined') {
			throw new Error('No erc1820Registry address supplied');
		}
		this.orgRegistryArtifacts = this.contractsResolver.resolve('OrgRegistry');
		this.orgRegistryArtifacts.erc1820RegistryAddress = erc1820RegistryAddress;
		return this;
	}

	addShield(erc1820RegistryAddress) {
		if (typeof erc1820RegistryAddress === 'undefined') {
			throw new Error('No erc1820Registry address supplied');
		}
		this.BN256G2Artifacts = this.contractsResolver.resolve('BN256G2');
		this.verifierArtifacts = this.contractsResolver.resolve('Verifier');
		this.shieldArtifacts = this.contractsResolver.resolve('Shield');
		this.verifierArtifacts.erc1820RegistryAddress = erc1820RegistryAddress;
		this.shieldArtifacts.erc1820RegistryAddress = erc1820RegistryAddress;
		return this;
	}

	build() {
		return {
			orgRegistryArtifacts: this.orgRegistryArtifacts,
			BN256G2Artifacts: this.BN256G2Artifacts,
			verifierArtifacts: this.verifierArtifacts,
			shieldArtifacts: this.shieldArtifacts
		}
	}

}

module.exports = WorkgroupContractsBuilder