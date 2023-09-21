**NOTE**

> If you DO NOT need signature verification, follow the instructions in `snarkjs.md` instead.

# ECDSA Signature Circuit

There are a number of challenges to implementing ECDSA signature algorithms in zkSNARKs.

1. zkSNARK proving systems generally use specific elliptic curves (edwards, bn128, alt_bn128) that only allow operations on numbers represented as residues modulo a specific prime. This limits the maximum "register size" for numbers used in zkSNARK proofs to 254 bits. However, networks like Ethereum and Bitcoin use the Elliptic Curve Digital Signature Algorithm (ECDSA) and the secp256k1 curve, a NIST-standard curve that is not "SNARK-friendly." Operations on secp256k1 elliptic curve points involve arithmetic on 256-bit numbers, which would overflow the 254-bit registers allowed in today's SNARK systems. Implementing ECDSA algorithms inside requires us to build ZK circuits for BigInt arithmetic and secp256k1 operations using 254-bit registers; essentially, we must perform "non-native field arithmetic."

2. Certain options such as the [circom-ecdsa](https://github.com/0xPARC/circom-ecdsa), which implement "non-native field arithmetic" for performing ECDSA signature verification, have long trusted setup time, long circuit compilation time, large proving key sizes, etc.

## Comparisons

Circom-ECDSA: Groth16 on a 20-core 3.3GHz, 64G RAM
Spartan-ECDSA: SpartanNIZK on a 10-core M1 MacBook Pro, 16GB RAM

|                                                                                                  | circom-ecdsa  | spartan-ecdsa |
| ------------------------------------------------------------------------------------------------ | ------------- | ------------- |
| ZKSnark Protocol                                                                                 | Groth16       | SpartanNIZK   |
| Curve used                                                                                       | BN128         | Secq256k1     |
| Constraints                                                                                      | 9480361       | 8,076         |
| Powers of Tau Ceremony ( 1. available curves - bn128, bls12-381 2. Number of constraints - 2^21) | several hours | Not needed    |
| Circuit compilation                                                                              | 324s          | 5s            |
| Witness generation                                                                               | 150s          | 3s            |
| Trusted setup phase 2 key generation                                                             | 5569s         | Not needed    |
| Trusted setup phase 2 contribution                                                               | 767s          | Not needed    |
| Proving key size                                                                                 | 5.8GB         | Not needed    |
| Proving key verification                                                                         | 6211s         | Not needed    |
| Proving time                                                                                     | 239s          | 2s            |
| Verification time                                                                                | <1s           | 300ms         |
| Proof size                                                                                       | 128bytes      | 16kb          |

Sources:

- Circom-ecdsa: [1](https://0xparc.org/blog/zk-ecdsa-1) , [2](https://github.com/0xPARC/circom-ecdsa) , [3](https://github.com/iden3/snarkjs)
- Spartan-ecdsa: [4](https://personaelabs.org/posts/spartan-ecdsa/) , [5](https://eprint.iacr.org/2019/550.pdf) , [6](https://github.com/personaelabs/spartan-ecdsa)

Reasons for not using PLONK:

Although PLONK doesn't require a trusted setup per application-specific circuit, it does require the powers of tau ceremony. [7](https://blog.iden3.io/circom-snarkjs-plonk.html) Ptau is only available for BN128 and BLS12-381 curves, making it incompatible with fast circuits that use Secq256k1 curve. [8](https://github.com/iden3/snarkjs)

**Spartan-ECDSA has been chosen because it is the fastest and most efficient zk-SNARK protocol for ECDSA signature verification circuits.**

## Spartan-ECDSA

- Based on the Spartan Non-Interactive Zero-knowledge Proof (SpartanNIZK)
- Fastest open-source method to verify secp256k1 ECDSA signatures
- Doesn’t require a trusted setup
- In the case of ECDSA verification, can work on elliptic curve where discrete log holds

Article/Research paper: [1](https://personaelabs.org/posts/spartan-ecdsa/) , [2](https://eprint.iacr.org/2019/550.pdf)
Github: [Link](https://github.com/personaelabs/spartan-ecdsa)

## Pre-Setup Installations

[Detailed Instructions](https://docs.circom.io/getting-started/installation/#installing-dependencies)

Step 1: Install Rust

Circom is written in Rust.

`curl --proto '=https' --tlsv1.2 https://sh.rustup.rs -sSf | sh`

Step 2: Install Circom

Run the following commands from the directory where your computer stores global libraries.

`git clone https://github.com/DanTehrani/circom-secq`

`cd circom`

`cargo build --release`

`cargo install --path circom`

Step 3: Install Snarkjs

`npm install -g snarkjs@0.5.0`

Step 4: Install Wasm-Pack

`curl https://rustwasm.github.io/wasm-pack/installer/init.sh -sSf | sh`

> **Note**
>
> Snarkjs version 0.5.0 is used because it is more stable than the latest version (0.7.0).

## Setup

[Detailed Instructions](https://github.com/biscuitdey/spartan-ecdsa)

We need to generate `.circuit` and `.wasm` files from our circom files. These files would then be utilized in witness and proof generation.

`git clone https://github.com/biscuitdey/spartan-ecdsa.git`

`cd spartan-ecdsa`

Add your circom circuit files to the `baseline/circuits` folder of the spartan-ecdsa directory.

`npm run build`
`npm run compile:circuit <name_of_circuit> <number_of_public_inputs>`

The compiled artifacts would be available under `baseline/artifacts`. You can copy these artifacts into the `./zeroKnowledgeArtifacts/circuits` folder under the bri-3 root directory.
