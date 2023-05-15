# Snarkjs Circuit

## Description

This document describes the setup and process for generating zero-knowledge proofs using snarkjs. The circuits are written and compiled using [Circom](https://docs.circom.io/getting-started/installation/), which is written in Rust. Then, the snarkjs library is used to generate proofs from these compiled circuits.

## Pre-Setup Installations

[Detailed Instructions](https://docs.circom.io/getting-started/installation/#installing-dependencies)

Step 1: Install Rust

`curl --proto '=https' --tlsv1.2 https://sh.rustup.rs -sSf | sh`

Step 2: Install Circom

`git clone https://github.com/iden3/circom.git`

`cd circom`

`cargo build --release`

`cargo install --path circom`

Step 3: Install Snarkjs

`npm install -g snarkjs`

## Setup

[Detailed Instructions](https://github.com/iden3/snarkjs)

We are going to use the Groth16 zk-SNARK protocol. To use this protocol, we need to generate a trusted setup. Groth16 requires a per circuit trusted setup. This trusted setup consists of 2 parts:

- The powers of tau, which is independent of the circuit.
- The phase 2, which depends on the circuit.

The commands for these two steps have been combined into ptau.sh and circuit.sh, respectively.

Step 1: `npm run snarkjs:ptau`
Step 2: `npm run snarkjs:circuit`
