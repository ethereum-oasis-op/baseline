# ZK Verifier Contracts for Groth16 and FFLONK

This folder contains two ZK-Proof Verification contracts for Solidity:

* one for the Groth16 prover system requiring the proof, the public input, AND the verification key, AND the Common Reference String from the Trusted Setup as input parameters.
* one for the performance optimized FF PLONK prover system that has a universal Trusted Setup, and only requires the proof, the public input, and the verification key as input parameters. The latest version of the Trusted Setup  can be found [here](https://hermez.s3-eu-west-1.amazonaws.com/powersOfTau28_hez_final.ptau).

The idea is that these contracts can be used by anyone to verify proofs generated during the BPI Interop Demo.