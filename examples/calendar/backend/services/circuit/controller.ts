/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable prettier/prettier */
import { NextFunction, Request, Response } from "express";
import { User } from "../../models/user.model";
import { Time } from "../../models/time.model";
import { Appointment } from "../../models/appointment.model";
import { generateProof } from "../lib/generateProof";
import { MerkleTree } from "fixed-merkle-tree";
import { BigNumber } from "ethers";
import { PoseidonHasher } from "../lib/hasher";
//@ts-ignore
import { buildPoseidon } from "circomlibjs";
const { utils } = require("ffjavascript");

import Web3 from "web3";
import PrivateKeyProvider from "truffle-privatekey-provider";

const verifier_artifact = require("./../../build/contracts/Verifier.json");

const truffle = require("@truffle/contract");
export const proof = async (req: Request, res: Response, next: NextFunction) => {
	const { secret, publicAddress, slot } = req.body;
	const times = await Time.findAll({
		where: {
			timeStart: {
				$gte: Date.now()
			}
		},
		limit: 5
	});
	const appointment = await Appointment.findOne({ where: { secret: secret }, limit: 1 });
	const user = await User.findOne({ where: { address: publicAddress } });
	const poseidon = new PoseidonHasher(await buildPoseidon());
	const tree = new MerkleTree(5, [], {
		hashFunction: (a, b) => poseidon.hash(BigNumber.from(a), BigNumber.from(b)).toString(),
		zeroElement: "1"
	});

	try {
		if (times !== null && appointment !== null && user !== null && times.length > 1) {
			(times as any).forEach((time: any) => {
				tree.insert(time?.dataValues?.timestart.toString());
			});
			const path = tree.proof(slot);
			const proof = await generateProof({
				time_slot_leaves: path?.pathElements,
				root: tree?.root.toString(),
				selected_time: slot,
				time_slot_indices: path?.pathIndices
			});
			appointment.status = "pending";
			appointment.fromUser = user.id;
			appointment.toUser = times[0].user;
			await appointment?.save();
			return res.status(200).send({ proof: proof, appointment: appointment });
		}
	} catch {
		return res.status(200).send({ error: "An error occurred while generating proof!" });
	}
};

export const verify = async (req: Request, res: Response, next: NextFunction) => {
	const { secret, slot } = req.body;
	const verifier_address = process.env.VERIFIER_ADDRESS || "";
	const times = await Time.findAll({
		where: { secret: secret, status: "available" },
		limit: 5
	});
	const appointment = await Appointment.findOne({
		where: { secret: secret },
		limit: 1
	});
	const poseidon = new PoseidonHasher(await buildPoseidon());
	const tree = new MerkleTree(5, [], {
		hashFunction: (a, b) => poseidon.hash(BigNumber.from(a), BigNumber.from(b)).toString(),
		zeroElement: "1"
	});

	try {
		(times as any).forEach((time: any) => {
			tree.insert(time?.dataValues?.timestart.toString());
		});
		const path = tree.proof(slot);
		const publicInputs = {
			root: tree?.root.toString(),
			time_slot_leaves: path?.pathElements,
			time_slot_indices: path?.pathIndices,
			selected_time: slot
		};
		const publicInputsMain = [tree?.root.toString(), path?.pathElements, path?.pathIndices, slot].flat();
		const publicInputsStr = utils.stringifyBigInts(publicInputs);
		const proof = await generateProof(publicInputsStr);
		const provider = new PrivateKeyProvider(process.env.PRIVATE_KEY_ACCOUNT, process.env.PROVIDER);
		const web3 = new Web3(provider);
		const Verifier = truffle(verifier_artifact);
		Verifier.setProvider(web3.currentProvider);
		const deployed = await Verifier.at(verifier_address);
		const verified = await deployed.verifyProof(
			[proof.pi_a[0], proof.pi_a[1]],
			[
				[proof.pi_b[0][1], proof.pi_b[0][0]],
				[proof.pi_b[1][1], proof.pi_b[1][0]]
			],
			[proof.pi_c[0], proof.pi_c[1]],
			publicInputsMain
		);

		if (verified && appointment) {
			appointment.status = "confirmed";
			await appointment?.save();
			return res.status(200).send({ verified: true });
		} else return res.status(200).send({ verified: false });
	} catch (e) {
		return res.status(200).send({ verified: false });
	}
};
