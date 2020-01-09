# Radish34 zkSNARK circuit
Given a commitment `C` to a universal data structure and its public inputs, the SNARK proves the following:
1. Well formation of the commitment
2. Knowledge of the secret key of the sender based on his public key provided inside `C`
3. Verification of the recipient's signature (without revealing his identity) of some data inside `C`

The number of public inputs and their sizes is defined in the sequel following the buisiness logic and technical choices rationales.

## The commitment
The commitment `C` is the following:

`C = {ø, id, idEntangled, metada, logicVerifier, state, ownerAddress, recipientAddress, recipientSignature}`

where:
- `ø`: a random salt
- `id`: the identifier of the document (RFQ, MSA, PO, invoice)
- `idEntangled`: the identifier of the entangled document (`Null`, RFQ, MSA, PO for respectivele RFQ, MSA, PO, invoice)
- `metada`: the tx metada (cf. Radish34 design document)
- `logicVerifier`: the opcode for a function of the smart contract
- `state`: to know what the ability to reference a comitment in the entangle id is
- `ownerAddress`: the public key of the sender
- `recipientAddress`: the public key of the recipient
- `recipientSignature`: the recipient's signature of `(ø||id||idEntangled||metada||logicVerifier||state)` where `||` stands for concatenation

the sizes of these field will be defined in the sequel according to the technical choices rationale.

## Buisiness logic rationale
See Radish34 Privacy Design document.

## Technical choices rationale
Here we look at the size of the fields in the commitment `C`, the choice of the signature scheme and the related public keys and the choice of the commitment scheme. We base the analysis on a security/cost tradeoff model.

- We would like to replace SHA256 that consists mostly of boolean operations, so it is not efficient to evaluate inside of a zk-SNARK circuit, which is an arithmetic circuit over a large prime field. Each invocation of SHA256 currently adds tens of thousands of multiplication gates, making it the primary cost during proving. We choose Pedersen hash over baby-Jubjub curve as a commitment scheme because:
    - The collision-resistance reduces to discrete-log assumptions.
    - It costs about 2 constraints per bit on an Edwards shaped curve built on top of ALT_BN128, namely baby-Jubjub curve. In fact when doing elliptic curve arithmetic inside a SNARK, the arithmetic order should be equal to the SNARK verification arithmetic order. Otherwise, a huge blowup would hinder efficient implementation.
- For the same arithmetic mismatch problem, we choose to use EdDSA signature over baby-Jubjub curve.

Following these arguments, the size of the fields inside `C` should be:
- `ø`: 128bit
- `id`: 128bit (flexible, can be changed)
- `idEntangled`: 128bit (flexible, can be changed)
- `metada`: 1024bit (flexible, can be changed)
- `logicVerifier`: 2048bit (flexible, can be changed)
- `state`: 1bit (we need only 1 bit)
- `ownerAddress`: 255bit (the field characteristic of baby-Jubjub for the x coordinate and 1bit for the sign of y)
- `recipientAddress`: 255bit (the field characteristic of baby-Jubjub for the x coordinate and 1bit for the sign of y)
- `recipientSignature`: 506bit (a pair (R,S) where R is a point on baby-Jubjub and S a field element. The point can be encoded to 255bit and the field element is 251bit as the subgroup order size. Normally, it can be encoded to 2b-bit where `2^(b-1)>char(field)` but not sure zokrates handles this)

Zokrates has a type `field` which is 254bit, so elements are encoded as `field[i]` where `i` is the multiple of 254bit chunks. Hence,
- `ø`: `field`
- `id`: `field`
- `idEntangled`: `field`
- `metada`: `field[5]`
- `logicVerifier`: `field[9]`
- `state`: `field`
- `ownerAddress`: `field[2]`
- `recipientAddress`: `field[2]`
- `recipientSignature`: `field[3]`


## Security considerations
Here we assess the security of the approach wrt to generic attacks on the underlying cryptographic primitives used. 

- Security of the commitment: The security of the CRH reduces to DLOG over baby-Jubjub curve. It is an Edwards curve with a big embedding degree and CM discriminant different than 3 so the best attack is Pollard's rho which has a complexity about `sqrt(subgroup order)=127bit` (standard security)
- Security of the signature: The EdDSA scheme is based on DLOG assumption over baby-Jubjub so the security is `127bit` (standard security)
- Security of the SNARK circuit: We use zokrates implementation (backed by Bellman community edition) of Groth16 schemes. Imprecisely and roughly speaking, the security reduces the KoE assumption on ALT_BN128 (used by zokrates). It has a security less than 100bit (below standard security). It is to note that, Cheon's attack applies but is uninteresting in ALT_BN128 case in general and in our circuit in particular. In fact, in general for the biggest circuit that can be generated on this curve (2^28 constaints) the security is better than the one under generic STNFS and in particular it our circuit should way smaller.
