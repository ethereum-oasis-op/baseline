#!/bin/sh
set -e

# --------------------------------------------------------------------------------
# Phase 1
# Circiut-independent setup

# make ptau folder
[ -d zeroKnowledgeArtifacts/ptau ] || mkdir zeroKnowledgeArtifacts/ptau

# Starts Powers Of Tau ceremony, creating the file pot14_0000.ptau
# 14 is the power of two of the maximum number of constraints that the ceremony can accept: in this case, the number of constraints is 2 ^ 14 = 16,384.
snarkjs powersoftau new bn128 14 zeroKnowledgeArtifacts/ptau/pot14_0000.ptau -v

# Contribute to ceremony a few times.
# As we want this to be non-interactive we'll just write something random-ish for entropy
snarkjs powersoftau contribute zeroKnowledgeArtifacts/ptau/pot14_0000.ptau zeroKnowledgeArtifacts/ptau/pot14_0001.ptau \
    --name="First contribution" -v -e="$(head -n 4096 /dev/urandom | openssl sha1)"
snarkjs powersoftau contribute zeroKnowledgeArtifacts/ptau/pot14_0001.ptau zeroKnowledgeArtifacts/ptau/pot14_0002.ptau \
    --name="Second contribution" -v -e="$(head -n 4096 /dev/urandom | openssl sha1)"
snarkjs powersoftau contribute zeroKnowledgeArtifacts/ptau/pot14_0002.ptau zeroKnowledgeArtifacts/ptau/pot14_0003.ptau \
    --name="Third contribution" -v -e="$(head -n 4096 /dev/urandom | openssl sha1)"

# Verify
snarkjs powersoftau verify zeroKnowledgeArtifacts/ptau/pot14_0003.ptau

# Apply random beacon to finalise this phase of the setup.
# For more information about random beacons see here: https://eprint.iacr.org/2017/1050.pdf
# For the purposes, the beacon is essentially a delayed hash function evaluated on 0102030405060708090a0b0c0d0e0f101112131415161718191a1b1c1d1e1f
# as given in snarkjs docs.

snarkjs powersoftau beacon zeroKnowledgeArtifacts/ptau/pot14_0003.ptau zeroKnowledgeArtifacts/ptau/pot14_beacon.ptau \
    0102030405060708090a0b0c0d0e0f101112131415161718191a1b1c1d1e1f 10 -n="Final Beacon"

# Prepare phase 2...
# Under the hood, the prepare phase2 command calculates the encrypted evaluation of the Lagrange polynomials at tau for
# tau, alpha*tau and beta*tau. It takes the beacon ptau file we generated in the previous step, and outputs a final pta
# file which will be used to generate the circuit proving and verification keys.
snarkjs powersoftau prepare phase2 zeroKnowledgeArtifacts/ptau/pot14_beacon.ptau zeroKnowledgeArtifacts/ptau/pot14_final.ptau -v

# Verify the final ptau file. Creates the file pot14_final.ptau
snarkjs powersoftau verify zeroKnowledgeArtifacts/ptau/pot14_final.ptau

echo "------------------Phase 1 complete-------------------------"