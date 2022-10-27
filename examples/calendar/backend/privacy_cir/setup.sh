mkdir -p ptau
# Power of tau
snarkjs powersoftau new bn128 14 ptau/pot12_0000.ptau
snarkjs powersoftau contribute ptau/pot12_0000.ptau ptau/pot12_0001.ptau --name="First contribution" -e="$(head -n 4096 /dev/urandom | openssl sha1)"
snarkjs powersoftau verify ptau/pot12_0001.ptau

# Phase 2
snarkjs powersoftau prepare phase2 ptau/pot12_0001.ptau ptau/pot12_final.ptau -e="$(head -n 4096 /dev/urandom | openssl sha1)"
snarkjs powersoftau verify ptau/pot12_final.ptau