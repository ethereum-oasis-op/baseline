const { ethers } = require('hardhat')

const abiCoder = new ethers.utils.AbiCoder();

/**
 * Abi Encode data given typed data
 *
 * @param {Object} data - typed data to sign
 * @notice example: {
 *   types: ['uint256', 'address'],
 *   values: [0, 0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE]
 * }
 * @return data encoded by abi encoder
 */
const encodeData = async (types, values) => {
    return abiCoder.encode(types, values);
}

module.exports = { abiCoder, encodeData }