/**
 * Builder class for Protocol contracts. Currently tailored to Radish34 usecase. To be abstracted further with the emergence of unified standard.
 */
class ProtocolContractsBuilder {

	/**
	 * 
	 * @param {*} contractsResolver - the contract artifacts resolver that will be used to resolve the needed artifacts
	 */
	constructor(contractsResolver) {
		this.contractsResolver = contractsResolver;
	}

	/**
	 * Updates the task to include the creation of ERC1820Registry too.
	 * 
	 */
	addErc1820Registry() {
		this.erc1820Artifacts = this.contractsResolver.resolve('ERC1820Registry');
		return this;
	}

	/**
	 * Builds and returns the task object to be passed to the deployer class. Waits for all artifacts to be resolved before returning.
	 */
	async build() {
		return {
			erc1820Artifacts: await this.erc1820Artifacts
		}
	}

}

module.exports = ProtocolContractsBuilder