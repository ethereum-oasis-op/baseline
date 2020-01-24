from zokrates_pycrypto.gadgets.pedersenHasher import PedersenHasher

# C = {ø, id, idEntangled, metada, logicVerifier, state, ownerAddress, recipientAddress, recipientSignature}

phi = '0x1234567'
idx = '0x124560'
idEntangled = '0x1267345'
metadata = '0x1236745'
logicVerifier = '0x17871234567'
state = '0x1'
ownerAdress = '0x1230074567'
recipientAdress = '0x126586834567'
recipientSignature = '0x123986984567'

inputlist = [phi, idx, idEntangled, metadata, logicVerifier, state, ownerAdress, recipientAdress, recipientSignature]
universal_input = ''.join([format(int(c, 16), '02X') for c in reversed(inputlist)])

preimage = bytes.fromhex(str(universal_input))
# create an instance with personalisation string
hasher = PedersenHasher(b"radish34")
# hash payload
digest = hasher.hash_bytes(preimage)
print(digest)

# write ZoKrates DSL code to disk
path = "pedersen.zok"
hasher.write_dsl_code(path)

# write witness arguments to disk
path = "pedersen_witness.txt"
witness = hasher.gen_dsl_witness_bytes(preimage)
with open(path, "w+") as f:
        f.write(" ".join(witness))
