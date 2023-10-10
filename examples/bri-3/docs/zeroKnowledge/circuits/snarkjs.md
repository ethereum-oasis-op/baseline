# Snarkjs Circuit

This document describes the setup and process for generating zero-knowledge proofs using snarkjs. The circuits are written and compiled using [Circom](https://docs.circom.io/getting-started/installation/). Then, the [snarkjs](https://github.com/iden3/snarkjs) library is used to generate proofs from these compiled circuits.

> **Note**
>
> There are other available zk circuit libraries such as gnark.
>
> Here is a [link](https://blog.celer.network/2023/03/01/the-pantheon-of-zero-knowledge-proof-development-frameworks/) for comparing performances of gnark and snarkjs circuit libraries. To summarise,
>
> - Proof generation time: For Groth16, gnark is 5~10 times faster than snarkjs
> - Peak memory usage: It is comparable for both libraries.
> - CPU utilisation: Gnark shows better CPU utilisation.
>
> However, our team chose snarkjs due to its ease of development (a separate service for running zk-circuits in golang is not required). Also, It was deemed sufficient for our use case based on the number of constraints in our circuit.
>
> The zero knowledge proof module interface allows these libraries to be used interchangeably. According to your requirement, you may write new circuits in your preferred library and plug it into this module.

## Pre-Setup Installations

[Detailed Instructions](https://docs.circom.io/getting-started/installation/#installing-dependencies)

Step 1: Install Rust

Circom is written in Rust.

`curl --proto '=https' --tlsv1.2 https://sh.rustup.rs -sSf | sh`

Step 2: Install Circom

Run the following commands from the directory where your computer stores global libraries.

`git clone https://github.com/iden3/circom.git`

`cd circom`

`cargo build --release`

`cargo install --path circom`

Step 3: Install Snarkjs

`npm install -g snarkjs@0.5.0`

> **Note**
>
> Snarkjs version 0.5.0 is used because it is more stable than the latest version (0.7.0).

## Setup

[Detailed Instructions](https://github.com/iden3/snarkjs)

We are going to use the Groth16 zk-SNARK protocol. To use this protocol, we need to generate a trusted setup, which will be completed in 2 phases (circuit-independent and circuit-specific). The goal of the setup is to generate trustworthy cryptographic keys for securing the zero-knowledge proof systems.

- Phase 1 (circuit-independent): Powers of tau ceremony. This ensures that the toxic waste generated during the trusted setup is discarded and guarantees zero-knowledge of the resulting proofs, even if all participants were compromised.

- Phase 2 (circuit-specific): Compiles the circuit and generates the proving and verification keys.
  Flags:
  1.  Protocol = Select either groth16 or plonk
  2.  Circuit name = Pass the circuit name

The commands for these two phases have been combined into ptau.sh and circuit.sh, respectively.

Phase 1: `npm run snarkjs:ptau`

Phase 2: `npm run snarkjs:circuit --protocol={protocol} --circuitName={circuitName}`
