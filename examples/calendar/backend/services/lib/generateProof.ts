/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-var-requires */
const groth16 = require("snarkjs").groth16;
// @ts-ignore
import { utils } from "ffjavascript";

export type Input = {
	time_slot_leaves: any;
	root: string;
	time_slot_indices: number[];
	selected_time: string;
};

export type Proof = {
	pi_a: string[3];
	pi_b: string[3][2];
	pi_c: string[2];
	protocol: string;
	curve: string;
};

export const generateProof = async (input: Input): Promise<Proof> => {
	const { proof, publicSignals } = await groth16.fullProve(
		utils.stringifyBigInts(input),
		"./contracts/artifacts/calendar.wasm",
		"./contracts/artifacts/calendar.zkey"
	);
	console.log("public signals", publicSignals);

	return proof;
};
