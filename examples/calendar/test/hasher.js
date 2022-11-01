import { BigNumber } from "ethers";

export class PoseidonHasher {
	poseidon;

	constructor(poseidon) {
		this.poseidon = poseidon;
	}

	hash(left, right) {
		const hash = this.poseidon([left, right]);
		return BigNumber.from(this.poseidon.F.toString(hash));
	}
}
