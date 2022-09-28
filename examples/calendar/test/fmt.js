/* eslint-disable @typescript-eslint/ban-ts-comment */
import { MerkleTree } from "fixed-merkle-tree";
import { PoseidonHasher } from "./hasher.js";
// @ts-ignore
import { buildPoseidon } from "circomlibjs";

import { BigNumber, ethers } from "ethers";
(async function () {
	const poseidon = new PoseidonHasher(await buildPoseidon());
	const randomBN = (nbytes = 31) => BigNumber.from(ethers.utils.randomBytes(nbytes));

	const commitment = 3;

	const tree = new MerkleTree(5, [], {
		hashFunction: (a, b) => poseidon.hash(BigNumber.from(a), BigNumber.from(b)).toString(),
		zeroElement: "1"
	});
	tree.insert("2");
	tree.insert("3");
	tree.insert("4");
	tree.insert("5");
	const path = tree.proof("2");
	console.log(path);
	//console.log('root', tree);
})();
