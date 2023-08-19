#!/bin/sh
set -e

# --------------------------------------------------------------------------------
# Phase 2
# Circuit-specific setup

# if zeroKnowledgeArtifacts/circuit does not exist, make folder
[ -d zeroKnowledgeArtifacts/circuit ] || mkdir zeroKnowledgeArtifacts/circuit

# Compile circuits
circom src/bri/zeroKnowledgeProof/services/circuit/snarkjs/$1.circom -o zeroKnowledgeArtifacts/circuit --r1cs --wasm

#Setup
snarkjs groth16 setup zeroKnowledgeArtifacts/circuit/$1.r1cs zeroKnowledgeArtifacts/ptau/pot20_final.ptau zeroKnowledgeArtifacts/circuit/$1_final.zkey

## Generate reference zkey -
## The zkey is a zero-knowledge key that includes both the proving and verification keys as well as phase 2 contributions.
## Importantly, one can verify whether a zkey belongs to a specific circuit or not.
snarkjs zkey new zeroKnowledgeArtifacts/circuit/$1.r1cs zeroKnowledgeArtifacts/ptau/pot20_final.ptau zeroKnowledgeArtifacts/circuit/$1_0000.zkey

## Ceremony just like before but for zkey this time
snarkjs zkey contribute zeroKnowledgeArtifacts/circuit/$1_0000.zkey zeroKnowledgeArtifacts/circuit/$1_0001.zkey \
    --name="First circuit contribution" -v -e="$(head -n 4096 /dev/urandom | openssl sha1)"
snarkjs zkey contribute zeroKnowledgeArtifacts/circuit/$1_0001.zkey zeroKnowledgeArtifacts/circuit/$1_0002.zkey \
    --name="Second circuit contribution" -v -e="$(head -n 4096 /dev/urandom | openssl sha1)"
snarkjs zkey contribute zeroKnowledgeArtifacts/circuit/$1_0002.zkey zeroKnowledgeArtifacts/circuit/$1_0003.zkey \
    --name="Third circuit contribution" -v -e="$(head -n 4096 /dev/urandom | openssl sha1)"

##  Verify if zkey belongs to our specific circuit
snarkjs zkey verify zeroKnowledgeArtifacts/circuit/$1.r1cs zeroKnowledgeArtifacts/ptau/pot20_final.ptau zeroKnowledgeArtifacts/circuit/$1_0003.zkey

## Apply random beacon as before
snarkjs zkey beacon zeroKnowledgeArtifacts/circuit/$1_0003.zkey zeroKnowledgeArtifacts/circuit/$1_final.zkey \
    0102030405060708090a0b0c0d0e0f101112131415161718191a1b1c1d1e1f 10 -n="Circuit FinalBeacon phase2"

## Optional: verify final zkey
snarkjs zkey verify zeroKnowledgeArtifacts/circuit/$1.r1cs zeroKnowledgeArtifacts/ptau/pot20_final.ptau zeroKnowledgeArtifacts/circuit/$1_final.zkey

## Export verification key
snarkjs zkey export verificationkey zeroKnowledgeArtifacts/circuit/$1_final.zkey zeroKnowledgeArtifacts/circuit/$1_verification_key.json

# Export circuit verifier with updated name and solidity version
snarkjs zkey export solidityverifier zeroKnowledgeArtifacts/circuit/$1_final.zkey src/bri/zeroKnowledgeProof/services/circuit/snarkjs/$1Verifier.sol

echo "------------------Phase 2 complete-------------------------"