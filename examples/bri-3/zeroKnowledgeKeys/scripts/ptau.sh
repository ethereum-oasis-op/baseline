#!/bin/sh
set -e

# --------------------------------------------------------------------------------
# Phase 1
# ... non-circuit-specific stuff

# make ptau folder
[ -d zeroKnowledgeKeys/ptau ] || mkdir zeroKnowledgeKeys/ptau

# Starts Powers Of Tau ceremony, creating the file pot12_0000.ptau
# 12 is the power of two of the maximum number of constraints that the ceremony can accept: in this case, the number of constraints is 2 ^ 12 = 4,096.
snarkjs powersoftau new bn128 12 zeroKnowledgeKeys/ptau/pot12_0000.ptau -v

# Contribute to ceremony a few times...
# As we want this to be non-interactive we'll just write something random-ish for entropy
snarkjs powersoftau contribute zeroKnowledgeKeys/ptau/pot12_0000.ptau zeroKnowledgeKeys/ptau/pot12_0001.ptau \
    --name="First contribution" -v -e="$(head -n 4096 /dev/urandom | openssl sha1)"
snarkjs powersoftau contribute zeroKnowledgeKeys/ptau/pot12_0001.ptau zeroKnowledgeKeys/ptau/pot12_0002.ptau \
    --name="Second contribution" -v -e="$(head -n 4096 /dev/urandom | openssl sha1)"
snarkjs powersoftau contribute zeroKnowledgeKeys/ptau/pot12_0002.ptau zeroKnowledgeKeys/ptau/pot12_0003.ptau \
    --name="Third contribution" -v -e="$(head -n 4096 /dev/urandom | openssl sha1)"

# Verify
snarkjs powersoftau verify zeroKnowledgeKeys/ptau/pot12_0003.ptau

# Apply random beacon to finalised this phase of the setup.
# For more information about random beacons see here: https://eprint.iacr.org/2017/1050.pdf
# For the purposes, the beacon is essentially a delayed hash function evaluated on 0102030405060708090a0b0c0d0e0f101112131415161718191a1b1c1d1e1f
# as given in snarkjs docs.

snarkjs powersoftau beacon zeroKnowledgeKeys/ptau/pot12_0003.ptau zeroKnowledgeKeys/ptau/pot12_beacon.ptau \
    0102030405060708090a0b0c0d0e0f101112131415161718191a1b1c1d1e1f 10 -n="Final Beacon"

# Prepare phase 2...
# Under the hood, the prepare phase2 command calculates the encrypted evaluation of the Lagrange polynomials at tau for
# tau, alpha*tau and beta*tau. It takes the beacon ptau file we generated in the previous step, and outputs a final pta
# file which will be used to generate the circuit proving and verification keys.
snarkjs powersoftau prepare phase2 zeroKnowledgeKeys/ptau/pot12_beacon.ptau zeroKnowledgeKeys/ptau/pot12_final.ptau -v

# Verify the final ptau file. Creates the file pot12_final.ptau
snarkjs powersoftau verify zeroKnowledgeKeys/ptau/pot12_final.ptau