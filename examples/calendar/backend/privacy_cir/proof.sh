circom calendar.circom --r1cs --wasm --sym --c
node calendar_js/generate_witness.js calendar_js/calendar.wasm input.json witness.wtns

snarkjs groth16 setup calendar.r1cs ptau/pot12_final.ptau calendar_0000.zkey
snarkjs zkey contribute calendar_0000.zkey calendar_0001.zkey --name="1st Contributor Name" -e="$(head -n 4096 /dev/urandom | openssl sha1)"
snarkjs zkey export verificationkey calendar_0001.zkey verification_key.json

# Prove
snarkjs groth16 prove calendar_0001.zkey witness.wtns proof.json public.json

# Verify
snarkjs groth16 verify verification_key.json public.json proof.json

#create smart contract
snarkjs zkey export solidityverifier calendar_0001.zkey verifier.sol
