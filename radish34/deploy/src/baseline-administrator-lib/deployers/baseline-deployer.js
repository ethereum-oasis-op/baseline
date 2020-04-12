const assert = require('assert');
const etherlimeLib = require('etherlime-lib');

const ProtocolContractsBuilder = require('./builders/protocol-contracts-builder.js');
const WorkgroupContractsBuilder = require('./builders/workgroup-contracts-builder.js');

/**
 * Deployment class currently tailored to Radish34 usecase. To be abstracted further with the emergence of unified standard.
 */
class BaselineDeployer {

	/**
	 * 
	 * @param {*} deployerWallet - The wallet to be used for deployment
	 * @param {*} provider - The provider to connect to
	 */
	constructor(deployerWallet, provider) {
		assert(deployerWallet, "Deployment wallet was not provided");
		assert(provider, "Provider was not provided");
		this.provider = provider;
		this.deployerWallet = deployerWallet.connect(provider)
	}

	/**
	 * Returns a new protocol contracts builder
	 * @param {*} contractsResolver - resolver to be used to resolve the contracts artifacts
	 */
	getProtocolBuilder(contractsResolver) {
		return new ProtocolContractsBuilder(contractsResolver);
	}

	/**
	 * Returns a new workgroup contracts builder
	 * @param {*} contractsResolver - resolver to be used to resolve the contracts artifacts
	 */
	getWorkgroupBuilder(contractsResolver) {
		return new WorkgroupContractsBuilder(contractsResolver);
	}

	/**
	 * Deploys the necessary contracts outlined in the deployProtocolTask
	 * 
	 * @param {object} deployProtocolTask - task object returned by the protocol builder build method
	 * @param {*} deployTransactionOverrides - ethers transaction overrides object to be applied to the transaction
	 * @returns object containing the resulting protocol contracts
	 */
	async deployProtocol(deployProtocolTask, deployTransactionOverrides) {
		if (typeof deployProtocolTask === 'undefined') {
			throw new Error('No deployment task supplied. Get one from  protocolBuilder.build()');
		}

		const deployer = new etherlimeLib.Deployer(this.deployerWallet, this.provider, deployTransactionOverrides);
		const result = {}

		const erc1820RegistryContract = await this._deployErc1820Registry(deployer, deployProtocolTask.erc1820Artifacts);

		result['ERC1820Registry'] = erc1820RegistryContract.contract;

		return result;
	}

	async _deployErc1820Registry(deployer, contractArtifacts) {
		if (typeof contractArtifacts === 'undefined') {
			throw new Error('No ERC1820Registry contract artifacts supplied');
		}

		return await deployer.deploy(contractArtifacts);
	}

	/**
	 * Deploys the necessary contracts outlined in the deployWorkgroupTask
	 * 
	 * @param {*} deployWorkgroupTask  - task object returned by the workgroup builder build method
	 * @param {*} deployTransactionOverrides  - ethers transaction overrides object to be applied to the transaction
	 * @returns object containing the resulting protocol contracts
	 */
	async deployWorkgroup(deployWorkgroupTask, deployTransactionOverrides) {
		if (typeof deployWorkgroupTask === 'undefined') {
			throw new Error('No deployment task supplied. Get one from  workgroupBuilder.build()');
		}

		const deployer = new etherlimeLib.Deployer(this.deployerWallet, this.provider, deployTransactionOverrides);
		let result = {}

		if (typeof deployWorkgroupTask.orgRegistryArtifacts !== 'undefined') {
			const orgRegistryContract = await this._deployOrgRegistry(deployer, deployWorkgroupTask.orgRegistryArtifacts, deployWorkgroupTask.erc1820RegistryAddress);
			result['OrgRegistry'] = orgRegistryContract.contract;
		}

		if (typeof deployWorkgroupTask.shieldArtifacts !== 'undefined') {
			const shieldContracts = await this._deployShield(deployer, deployWorkgroupTask.BN256G2Artifacts, deployWorkgroupTask.verifierArtifacts, deployWorkgroupTask.shieldArtifacts, deployWorkgroupTask.erc1820RegistryAddress);
			result = {
				...result,
				...shieldContracts
			}
		}

		return result;
	}

	async _deployOrgRegistry(deployer, contractArtifacts, erc1820RegistryAddress) {
		if (typeof contractArtifacts === 'undefined') {
			throw new Error('No OrgRegistry contract artifacts supplied');
		}

		return await deployer.deploy(contractArtifacts, {}, erc1820RegistryAddress);
	}

	async _deployShield(deployer, bnArtifacts, verifierArtifacts, shieldArtifacts, erc1820RegistryAddress) {
		if (typeof bnArtifacts === 'undefined') {
			throw new Error('No BN256G2 contract artifacts supplied');
		}

		if (typeof verifierArtifacts === 'undefined') {
			throw new Error('No Verifier contract artifacts supplied');
		}

		if (typeof shieldArtifacts === 'undefined') {
			throw new Error('No Shield contract artifacts supplied');
		}


		const BNContract = await deployer.deploy(bnArtifacts, {});

		const VerifierContract = await deployer.deploy(verifierArtifacts, {
			'BN256G2': BNContract.contractAddress
		}, erc1820RegistryAddress);

		const ShieldContract = await deployer.deploy(shieldArtifacts, {}, VerifierContract.contractAddress, erc1820RegistryAddress)

		const result = {}
		result['BN256G2'] = BNContract.contract;
		result['Verifier'] = VerifierContract.contract;
		result['Shield'] = ShieldContract.contract;

		return result;
	}



}

module.exports = BaselineDeployer