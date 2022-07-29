circom calendar.circom --r1cs --wasm --sym --c
node calendar_js/generate_witness.js $1_js/$1.wasm input.json witness.wtns

snarkjs groth16 setup calendar.r1cs ptau/pot12_final.ptau calendar_0000.zkey
snarkjs zkey contribute calendar_0000.zkey calendar_0001.zkey --name="1st Contributor Name" -e="$(head -n 4096 /dev/urandom | openssl sha1)"
snarkjs zkey export verificationkey calendar_0001.zkey verification_key.json

# Prove
snarkjs groth16 prove calendar_0001.zkey witness.wtns proof.json public.json

# Verify
snarkjs groth16 verify verification_key.json public.json proof.json