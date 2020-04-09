class ProtocolContractsBuilder {
	constructor(contractsResolver) {
		this.contractsResolver = contractsResolver;
	}

	addErc1820Registry() {
		this.erc1820Artifacts = this.contractsResolver.resolve('ERC1820Registry');
		return this;
	}

	async build() {
		return {
			erc1820Artifacts: await this.erc1820Artifacts
		}
	}

}

module.exports = ProtocolContractsBuilder