const path = require('path');
const assert = require('assert');
const ethers = require('ethers');

const DEFAULT_PATHS = {
	"ERC1820Registry": "./src/config/default-artifacts/ERC1820Registry.json",
	"Registrar": "./src/config/default-artifacts/Registrar.json",
	"OrgRegistry": "./src/config/default-artifacts/OrgRegistry.json",

	"Pairing": "./src/config/default-artifacts/Pairing.json",
	"BN256G2": "./src/config/default-artifacts/BN256G2.json",
	"Verifier": "./src/config/default-artifacts/Verifier.json",
	"Shield": "./src/config/default-artifacts/Shield.json"
}


/*  
	Replacing the __hash(path.name)__  with __libraryname__ become "somewhat of a standard" 
	as it allows for linking to happen on different machine than the compilation.

	This will allow deployment libraries to work out of the box.

	https://github.com/trufflesuite/truffle/blob/99add8f5e47586030a44a999bcfb287224e304e1/packages/contract/lib/utils/index.js#L146
	https://github.com/LimeChain/etherlime/blob/446b411961c50c36797727fea725d1bdc5a962c5/packages/etherlime-utils/utils/linking-utils.js#L5

	PS. I know it is ugly.
*/
const _replaceLibraryReferenceToTruffleStyle = (bytecode, linkReferences) => {
	for (const entry of Object.entries(linkReferences)) {
		const libraryReferenceObj = entry[1];

		for (const key of Object.keys(libraryReferenceObj)) {

			const metadata = libraryReferenceObj[key][0];

			const lengthBytes = metadata.length;
			const startBytes = metadata.start;

			// 1 byte is always encoded in 2 chars, thus doubling to find the correct length and start
			const lengthChars = lengthBytes * 2;
			const startChars = (startBytes * 2) + 2; // +2 to account for 0x

			const bytecodeBeforeLibraryLink = bytecode.substring(0, startChars)
			const bytecodeAfterLibraryLink = bytecode.substring(startChars + lengthChars);
			bytecode = `${bytecodeBeforeLibraryLink}__${key}__${bytecodeAfterLibraryLink}`
		}
	}

	return bytecode;

}

/**
 * Radish specific resolver for contract artifacts based on a configuration file containing artifacts paths
 */
class RadishConfigpathContractsResolver {

	/**
	 * 
	 * @param {object} paths - the configuration object. Keys in the object need to be the names of the contracts to be resolved. Values need to be path to the artifact files.
	 */
	constructor(paths) {
		this.paths = DEFAULT_PATHS;
		if (typeof paths !== 'undefined') {
			this.paths = require(paths);
		}
	}

	/**
	 * Resolves the contract artifacts for a contract with the supplied name
	 * @param {string} name - the name of the contract to be resolved
	 * @returns {object} - contains contractName, contract ABI and contract deployment unlinked bytecode
	 */
	async resolve(name) {
		assert(name, 'No name supplied to the resolver resolve method');
		const contractPath = path.resolve(this.paths[name]);
		const contractJSON = require(contractPath);

		const contractName = contractJSON.contractName;
		const abi = contractJSON.compilerOutput.abi;
		const bytecode = _replaceLibraryReferenceToTruffleStyle(contractJSON.compilerOutput.evm.bytecode.object, contractJSON.compilerOutput.evm.bytecode.linkReferences)

		return {
			contractName,
			abi,
			bytecode
		}
	}

	/**
	 * Resolves contract based on its name, address and connects it to the provider
	 * @param {*} name - the name of the contract to be resolved
	 * @param {*} address - the address it is located at
	 * @param {*} provider - the provider to be connected to.
	 */
	async resolveContractInstance(name, address, provider) {
		assert(name, 'No name supplied to the resolver resolveContractInstance method');
		assert(address, 'No address supplied to the resolver resolveContractInstance method');
		assert(provider, 'No provider supplied to the resolver resolveContractInstance method');
		const contractPath = path.resolve(this.paths[name]);
		const contractJSON = require(contractPath);

		const abi = contractJSON.compilerOutput.abi;

		const contract = new ethers.Contract(address, abi, provider);

		return contract;
	}


}

module.exports = RadishConfigpathContractsResolver