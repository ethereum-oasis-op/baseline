#!/bin/sh
set -e

# --------------------------------------------------------------------------------
# Phase 2
# ... circuit-specific stuff

# if zeroKnowledgeKeys/circuit does not exist, make folder
[ -d zeroKnowledgeKeys/circuit ] || mkdir zeroKnowledgeKeys/circuit

# Compile circuits
circom src/bri/zeroKnowledgeProof/services/circuit/snarkjs/circuit.circom -o zeroKnowledgeKeys/circuit --r1cs --wasm

#Setup
snarkjs groth16 setup zeroKnowledgeKeys/circuit/circuit.r1cs zeroKnowledgeKeys/ptau/pot12_final.ptau zeroKnowledgeKeys/circuit/circuit_final.zkey

# # Generate reference zkey
snarkjs zkey new zeroKnowledgeKeys/circuit/circuit.r1cs zeroKnowledgeKeys/ptau/pot12_final.ptau zeroKnowledgeKeys/circuit/circuit_0000.zkey

# # Ceremony just like before but for zkey this time
snarkjs zkey contribute zeroKnowledgeKeys/circuit/circuit_0000.zkey zeroKnowledgeKeys/circuit/circuit_0001.zkey \
    --name="First circuit contribution" -v -e="$(head -n 4096 /dev/urandom | openssl sha1)"
snarkjs zkey contribute zeroKnowledgeKeys/circuit/circuit_0001.zkey zeroKnowledgeKeys/circuit/circuit_0002.zkey \
    --name="Second circuit contribution" -v -e="$(head -n 4096 /dev/urandom | openssl sha1)"
snarkjs zkey contribute zeroKnowledgeKeys/circuit/circuit_0002.zkey zeroKnowledgeKeys/circuit/circuit_0003.zkey \
    --name="Third circuit contribution" -v -e="$(head -n 4096 /dev/urandom | openssl sha1)"

# #  Verify zkey
snarkjs zkey verify zeroKnowledgeKeys/circuit/circuit.r1cs zeroKnowledgeKeys/ptau/pot12_final.ptau zeroKnowledgeKeys/circuit/circuit_0003.zkey

# # Apply random beacon as before
snarkjs zkey beacon zeroKnowledgeKeys/circuit/circuit_0003.zkey zeroKnowledgeKeys/circuit/circuit_final.zkey \
    0102030405060708090a0b0c0d0e0f101112131415161718191a1b1c1d1e1f 10 -n="Circuit FinalBeacon phase2"

# # Optional: verify final zkey
snarkjs zkey verify zeroKnowledgeKeys/circuit/circuit.r1cs zeroKnowledgeKeys/ptau/pot12_final.ptau zeroKnowledgeKeys/circuit/circuit_final.zkey

# # Export verification key
snarkjs zkey export verificationkey zeroKnowledgeKeys/circuit/circuit_final.zkey zeroKnowledgeKeys/circuit/circuit_verification_key.json

# Export circuit verifier with updated name and solidity version
snarkjs zkey export solidityverifier zeroKnowledgeKeys/circuit/circuit_final.zkey src/bri/zeroKnowledgeProof/services/circuit/snarkjs/CircuitVerifier.sol
# sed -i'.bak' 's/0.6.11;/0.8.11;/g' contracts/CircuitVerifier.sol
sed -i'.bak' 's/contract Verifier/contract CircuitVerifier/g' src/bri/zeroKnowledgeProof/services/circuit/snarkjs/CircuitVerifier.sol

rm src/bri/zeroKnowledgeProof/services/circuit/snarkjs/*.bak