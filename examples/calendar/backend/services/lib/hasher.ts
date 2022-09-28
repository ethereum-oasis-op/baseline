import { BigNumber } from "ethers";

export class PoseidonHasher {
	poseidon;

	constructor(poseidon: any) {
		this.poseidon = poseidon;
	}

	hash(left: any, right: any) {
		const hash = this.poseidon([left, right]);
		return BigNumber.from(this.poseidon.F.toString(hash));
	}
}
