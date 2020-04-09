const assert = require('assert');
const {
	pollVk
} = require('./services/zkp');
const {
	hexToDec,
	flattenDeep
} = require('./utils/conversions');

const DEFAULT_CIRCUIT_NAMES = {
	createMSA: {
		txTypeEnumUint: 0, // Each circuit accompanies a function in the Shield contract. The Enum 'TransactionTypes' in the Shield contract is used to refer to each circuit/function. Each Enum option is assigned a number (from 0). We use this number to refer to an Enum option when calling the Shield contract.
	},
	createPO: {
		txTypeEnumUint: 1,
	},
}

class RadishZKPRestResolver {

	constructor(zkpUrl) {
		if (typeof zkpUrl === 'undefined') {
			throw new Error('Zero knowledge proofs service url not supplied');
		}
		this.zkpUrl = zkpUrl;
	}

	async resolveVerificationKey(circuitName) {
		assert(typeof DEFAULT_CIRCUIT_NAMES[circuitName] !== 'undefined');
		const vk = await pollVk(this.zkpUrl, circuitName);
		let vkArray = Object.values(vk);
		vkArray = flattenDeep(vkArray);
		vkArray = vkArray.map(coord => hexToDec(coord));
		return {
			vk,
			vkArray,
			actionType: DEFAULT_CIRCUIT_NAMES[circuitName].txTypeEnumUint
		}
	}

}

module.exports = RadishZKPRestResolver