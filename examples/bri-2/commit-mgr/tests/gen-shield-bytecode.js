const { ethers } = require("ethers");

const shieldContract = require("../../contracts/artifacts/Shield.json");

const myArgs = process.argv.slice(2);
const verifierAddress = myArgs[0];
const treeHeight = myArgs[1];

const abiCoder = new ethers.utils.AbiCoder();
// Encode the constructor parameters, then append to bytecode
const encodedParams = abiCoder.encode(["address", "uint"], [verifierAddress, treeHeight]);
const bytecodeWithParams = shieldContract.bytecode + encodedParams.slice(2).toString();

console.log('Shield.sol bytecode: \n', bytecodeWithParams);
