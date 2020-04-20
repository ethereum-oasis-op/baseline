const assert = require('assert');
const {
	pollVk
} = require('./services/zkp');
const {
	hexToDec,
	flattenDeep
} = require('./utils/conversions');

const DEFAULT_CIRCUITS = {
	createMSA: {
		txTypeEnumUint: 0, // Each circuit accompanies a function in the Shield contract. The Enum 'TransactionTypes' in the Shield contract is used to refer to each circuit/function. Each Enum option is assigned a number (from 0). We use this number to refer to an Enum option when calling the Shield contract.
	},
	createPO: {
		txTypeEnumUint: 1,
	},
}

/**
 * Radish specific ZKP verification keys resolver. Users REST to ask a ZKP service for the verification key of certain circuit.
 */
class RadishZKPRestResolver {

	/**
	 * 
	 * @param {string} zkpUrl the URL to the zkp service that will be used to resolve the verification key
	 */
	constructor(zkpUrl) {
		if (typeof zkpUrl === 'undefined') {
			throw new Error('Zero knowledge proofs service url not supplied');
		}
		this.zkpUrl = zkpUrl;
	}

	/**
	 * 
	 * @param {string} circuitName - Circuit name to be resolved via the zkpURL. Check DEFAULT_CIRCUITS for values.
	 */
	async resolveVerificationKey(circuitName) {
		assert(typeof DEFAULT_CIRCUITS[circuitName] !== 'undefined');
		const vk = await pollVk(this.zkpUrl, circuitName);
		let vkArray = Object.values(vk);
		vkArray = flattenDeep(vkArray);
		vkArray = vkArray.map(coord => hexToDec(coord));
		return {
			vk,
			vkArray,
			actionType: DEFAULT_CIRCUITS[circuitName].txTypeEnumUint
		}
	}

}

module.exports = RadishZKPRestResolver