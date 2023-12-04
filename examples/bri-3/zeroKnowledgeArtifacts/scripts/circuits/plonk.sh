#!/bin/sh
set -e

# --------------------------------------------------------------------------------
# Phase 2
# Circuit-specific setup

# if zeroKnowledgeArtifacts/circuits/$1 does not exist, make folder
[ -d zeroKnowledgeArtifacts/circuits/$1 ] || mkdir zeroKnowledgeArtifacts/circuits/$1

# Compile circuits
circom src/bri/zeroKnowledgeProof/services/circuit/snarkjs/$1.circom -o zeroKnowledgeArtifacts/circuits/$1 --r1cs --wasm

#Setup
## The zkey is a zero-knowledge key that includes both the proving and verification keys
snarkjs plonk setup zeroKnowledgeArtifacts/circuits/$1/$1.r1cs zeroKnowledgeArtifacts/ptau/pot15_final.ptau zeroKnowledgeArtifacts/circuits/$1/$1_final.zkey

## Export verification key
snarkjs zkey export verificationkey zeroKnowledgeArtifacts/circuits/$1/$1_final.zkey zeroKnowledgeArtifacts/circuits/$1/$1_verification_key.json

# Export circuit verifier with updated name and solidity version
snarkjs zkey export solidityverifier zeroKnowledgeArtifacts/circuits/$1/$1_final.zkey src/bri/zeroKnowledgeProof/services/circuit/snarkjs/$1Verifier.sol

echo "------------------Phase 2 complete-------------------------"