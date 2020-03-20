---
title: Zero Knowledge Service component
description: Detailed explanation of the privacy protocols under ZKP, using a toolbox called Zokrates
---

# Zero Knowledge Service component

## What is here?

This component is a RESTful service that leverages a library (`zokrates.js`) that wraps around Zokrates utility, to expose functionalities necessary for generation of proofs. Specifically, Zokrates is used to create zk-SNARK proofs, that can be verified on chain. In addition to RESTful services, the component also contains circuits in `zkp/circuits/`. These circuits are in the form of pure functions that correspond to the specific processes involved in the procurement use case.

zk-SNARK stands for "Zero Knowledge Succinct Non-Interactive Argument of Knowledge", and is a family of privacy tools called zero knowledge proofs (ZKP). While other privacy techniques like bulletproofs, ring signatures and stealth addresses, etc. mask the identities of the entities involved in a business transaction, ZKP techniques allow to prove logical statements without divulging any information and yet proving the validity of such proofs. Particularly, zk-SNARKs are mathematical concepts and tools to establish zero knowlege verification of succinct proofs, which convert logical statements to arithmetic circuits, that are then leveraged to generate proofs. References below provide further information on zk-SNARKS explainers and existing production implementation of a zk-SNARK (ZCash). Much of the work in Radish34 for ZKP adapts the model of shielded transactions from ZCash. The work on ZKPs in the case of Radish34 also particularly stems from prior work to leverage zk-SNARKs tooling to conduct token transfers under zero knowledge in EY Nightfall.

The following circuits were created to accommodate the Radish34 demo:
- createMSA: This circuit uses EdDSA libraries, sha256 hashing and tiering structure validation checks as imported functionalities to generate a proof for creation of an MSA
- createPO: This circuit uses sha256 hashing and tiering price calculation checks as imported functionalities to generate a proof for creation of a PO

These specialized circuits enforce correctness of the shared business logic that establishes a volume discount agreement with tiered pricing and ensures that a series of successive purchase orders are calculated against it without double-counting.

Going beyond the Radish34 demo, a developer may employ a generalized circuit that simply checks the consistency of each Party's off-chain data and business logic execution. But there is also an opportunity for industry standards bodies and regulators to develop libraries of circuits that they can require regulated workflows to employ. This would ensure that not only do counterparties maintain consistent information and run the same code, but that the code conforms to approved specifications.

Assumptions:
- GM17 is used as the proving mechanism for generation of zkSnark proofs. Although there are other proving schemes, GM17 was decided to be the proving scheme of choice to account for non-malleability of proofs, even though the verification time is higher than other state of the art schemes such as Groth16. It is easier to handle the malleability issue in the proving system rather than in the protocol (which means choosing GM17 over G16+extra steps) for a reason: the point of using G16 is to reduce the proof size and the verification cost but we do not have yet a well optimized protocol cost wise. Hence, the choice is to go with gm17 for radish34.
- A key aspect of the usage of the ZKP, is the choice of hashing mechanism. As part of proof generation, one of the inputs to the proof is the hash of the metadata, that is computed offline and also within the circuit to verify that correct hash been used for generating the proof of a document. Another place where hashing is leveraged is during the hashing of commitment in the Shield contract. Hashing used across all these positions is to be consistent, and therefore, SHA256 is used. Even though there are other hashing choices such as Pedersen, Mimc, Poseidon, etc., SHA256 was chosen to offset gas costs in comouting a SHA256 hash on chain are significantly cheaper than that of other hashing mechanisms

## How does this fit in to Radish34?

During the set up of the Radish34 server, the circuits are compiled and set up to generate proving and verifying keys. These are necessary to be present as part of the Zokrates container to be able to generate proofs at run time. Using `npm run setup-circuits`, at the root as part of setting up the system, all the necessary circuits can be set up for proof generation at run time

## How can I run it?

Run the following instruction to ensure that the service is up:

`docker-compose up -d zkp`

This will spin up the `zkp` container, which contains RESTful end points for interacting with the service. In the `dev` mode specified by the `docker-compose.yml` file, `babel` runs in the background to compile down to ES5 style code and `nodemon` watches for any file changes so that developers can make changes locally and the container will pickup on them automatically.

Logs should look like the following:

`zkp`: `docker-compose logs -f zkp`
```
zkp_1            | > nodemon ./dist/index.js
zkp_1            |
zkp_1            | [nodemon] 1.19.4
zkp_1            | [nodemon] to restart at any time, enter `rs`
zkp_1            | [nodemon] watching dir(s): *.*
zkp_1            | [nodemon] watching extensions: js,mjs,json
zkp_1            | [nodemon] starting `node ./dist/index.js`

```

`zkp` service is a RESTful service that makes use of `@eyblockchian/zokrates.js` package, and has the following end points. To be able to leverage the service, place the `.zok` file(s) at `/app/circuits/path/to/parent-dir/file.zok`, and run each of the instructions below per file. This service can be called from other containers using `http://radish34-zkp.docker` or expose a port in the `docker-compose.yml` (for example 8080, as in this case: replace with `http://localhost:8080` to run the below curl commands locally)

### `generateKeys`
This is a POST instruction that runs `compile`, `setup` and `exportVerifier` instructions.

Request body:
`filepath`: the path of the `.zok` file (relative to `/app/circuits/`).
E.g. for a file at `/app/circuits/path/to/test.zok` the filepath is `path/to/test.zok`.

The `/app/output` dir will contain the outputs of these steps copied from within the container.

Example: (Replace `path/to/test.zok` with the filepath of the file to be computed).  
`curl -d '{"filepath": "path/to/test.zok"}' -H "Content-Type: application/json" -X POST http://radish34-zkp/generate-keys`

### `generateProof`
This is a POST instruction that runs `compute-witness` and `generate-proof` instructions.

Request body:  
`filename`: the name of the `.zok` file (without the `.zok` file extension).
`inputs`: array of the arguments the the `main()` function of the circuit.

The `/app/output` dir has the outputs of these steps copied from within the container. When the `generate-proof` instruction is run, the corresponding `proof.json` is stored in the `/app/output` dir.  

Example: (Replace `filename` with the name of the file for which we're creating a witness).  
`curl -d '{"filename": "test", "inputs": [5, 25]}' -H "Content-Type: application/json" -X POST http://radish34-zkp/generate-proof`

Alternatively, the POSTMAN application can be used to run these curl requests.

Note: All the resultant files from the above steps/processes are created in a sub-directory under `/app/output` named with the input parameter, `filename` (where, for example, the filename is `test` for filepath `/app/circuits/path/to/test.zok`).

### `vk`

This is a GET request, to retrieve a vk from the db. (Note: a trusted setup will have to have taken place for the vk to exist).

Request body:
`id`: the name of the `.zok` file (without the `.zok` file extension).

Example:
`curl -d '{"id": "test"}' -H "Content-Type: application/json" -X GET http://radish34-zkp/vk`

### Testing individual `.zok` files

#### a) using the `./do` shell scripts

##### Requirements
Cargo is pre-installed on the container. Following instructions are for development utilities to run quick commands from terminal/console.

##### build

This instruction builds cargo to be able to run native instructions: `docker-compose exec zkp cd src && ./do build`

Following examples can be run, or custom written as scripts that could be mounted to the container to run one-off instructions.

```
cat path/to/<filename>.zok > test.zok
./do compile
./do setup
./do witness 3 9
./do generate
```

#### b) mounting to zokrates in the terminal

To test a particular `.zok` file manually in the terminal:

(You might need to do `docker pull zokrates/zokrates:0.5.1` if you haven't already).

`cd path/to/parent-dir-of-zok-file/`

`docker run -v $PWD:/home/zokrates/code -ti zokrates/zokrates:0.5.1 /bin/bash` (mounting to `/code` ensures the outputs from zokrates don't overwrite / mix with our local machine's files).

`./zokrates compile -i code/<filename>.zok`

`./zokrates setup`

`./zokrates compute-witness -a <inputs>`

`./zokrates generate-proof`


## What is the architecture?

Following the baseline protocol, the following segments detail out the ZKP components of the Radish34 architecture, to apply a procurement case against the baseline protocol. In the scope of the procurement process (RFP to MSA to PO), MSA and PO are the processes that are subject to constraints of privacy in the process

### MSA process
- Buyer & Seller agree on an MSA (Master Service Agreement). Buyer attests that the supplier has signed the MSA without revealing the identity of the supplier.
-
  ```
  msa = {
    publicKeyBuyer,
    publicKeySeller,

    volumeTierBounds: [],
    pricesByTier: [],
    volumePriceHash,
    minVolume,
    maxVolume,

    typeOfGood,
    erc20ContractAddress,
  }
  ```
- If we give this `msa` an `msaId`, we can store it in a directory of all MSA's:
-
  ```
  MSAs[msaId] = {
    constants: {
      publicKeyBuyer,
      publicKeySeller,
      volumeTierBounds: [],
      pricesByTier: [],
      volumePriceHash,
      minVolume,
      maxVolume,
      typeOfGood,
      erc20ContractAddress,
    },
    commitments: [{
      commitment,
      index,
      salt,
      preventifier,
      nullifier,
      variables: {
        accumulatedVolumeOrdered,
        accumulatedVolumeDelivered,
      }
    }]
  }
  ```
- Notice we have added a few arrays to track variable 'private states' as they change. We'll commit to our MSA, as well as the initial values of our 'private states':
-
  ```
  { accumulatedVolumeDelivered } = MSAs[msaId].commitments[0].variables
  { accumulatedVolumeOrdered } = MSAs[msaId].commitments[0].variables
  { salt } = MSAs[msaId].commitments[0]

  MSAs[msaId].commitments[0].commitment = H(
    publicKeyBuyer,
    publicKeySeller,
    volumePriceHash,
    minVolume,
    maxVolume,
    accumulatedVolumeDelivered,   // variable
    accumulatedVolumeOrdered,     // variable
    typeOfGood,
    erc20ContractAddress,
    salt                          // random
  )

  MSACommitment = MSAs[msaId].commitments[0].commitment
  ```
- Each time we want to update one of the variable private states, we will need to nullify the MSA commitment, and create a new one containing the updated variable private states (and a new random salt). I.e. we'll nullify `MSAs[msaId].commitments[0]` and create a new `MSAs[msaId].commitments[1]` in its place.

**Variable private states within the MSA commitment**

There are some updatable values which get hashed into the MSA commitment.

- Purchase Orders (PO's) will be created against this MSA.
  - The accumulated volume ordered (from all POs) needs to be tracked with each order (`accumulatedVolumeOrdered`). Using this, we'll be able to prevent the accumulated volume ordered under all PO's from exceeding the maximum volume prescribed under the MSA's tiered pricing table.
- Each delivery will be made against a PO, but we also need to track deliveries against the MSA agreement's tiered-pricing table.
  - The accumulated volume delivered under the MSA needs to be updated with each delivery (`accumulatedVolumeDelivered`). Using this, we'll be able to calculate the price of each delivery, based on the tiered-pricing table.

**Process**
- Both Buyer & Seller provide EdDSA signatures of the 0th `MSACommitment`:
  - Buyer's signature: `(R_B, S_B)` for the given `pk_B` and message `MSACommitment`
  - Seller's signature: `(R_S, S_S)` for the given `pk_S` and message `MSACommitment`
  - (Zokrates has this functionality in its StandardLib)
- `publicKeyBuyer = H(secretKeyBuyer)`
- `publicKeySeller = H(secretKeySeller)`
- `volumePriceHash`:

  | Volume Tiers | Price |
  |--------------|-------|
  |   0 -  100   |  200  |
  | 100 -  300   |  150  |
  | 300 - 1000   |  100  |

  Convert this table into vectors:

  `volumeTierBounds = [ v0, v1, v3, v3 ]`. To be valid, we need `v0 < v1 < v2 < v3`.

  `pricesByTier = [ p0, p1, p2 ]` There are no restrictions on the prices (increasing, decreasing, 'u'-shaped, 'n'-shaped price progressions are all valid).

  `volumePriceHash = H( ...volumeTierBounds, ...pricesByTier )`

We will store the `MSACommitment` in an **MSA commitments Merkle Tree** on-chain. Each time we need to update the 'updateable' states within an `MSACommitment`, we will need to nullify the current `MSACommitment`, and add an updated `MSACommitment` to the MSA commitments tree.



### MSACommitment Mint:
```
publicInputs = [
  MSACommitment,
]
```
```
privateInputs = [
  [R_B, S_B], pk_B, [R_S, S_S],  pk_S, "other EdDSA stuff",

  volumePriceHash,
  volumeTierBounds,
  pricesByTier,
  minVolume,
  maxVolume,

  accumulatedVolumeDelivered,
  accumulatedVolumeOrdered,

  typeOfGood,
  erc20ContractAddress,
  salt
]
```
- Notice we don't pass the `secretKey` of the Buyer nor the Seller, because one of those parties will be the one generating the proof! That's why we need the EdDSA signatures.

**Proof Steps**:
- Signature check
  - Prove both parties agree to the MSA. Verify the EdDSA signatures within the zk-SNARK (Zokrates has this functionality in its StandardLib) using the message `MSACommitment` and `[R_B, S_B], pk_B, [R_S, S_S],  pk_S, "other EdDSA stuff"`.
- Prove that the `MSACommitment` is well-formed. Some steps might seem unnecessary (because "Why sign an ill-formed MSACommitment?"). I've included them to protect the Buyer / Seller from 'ignorance' and 'mistakes' in programming the agreement:
  - Prove `v0 < v1 < v2 < v3 < ...` (strictly ascending `volumeTierBounds`).
  - Prove that `maxVolume` equals the right-most non-zero element of `volumeTierBounds`. We separate out `maxVolume` to make it easier to refer to in future proofs.
  - Prove that `minVolume` equals the first element of `volumeTierBounds`. We separate out `minVolume` to make it easier to refer to in future proofs.
  - Prove that the maximum total amount owed for this agreement won't overflow the Zokrates prime `q`! I.e. that `v0*p0 + v1*p1 + ... vn*pn < q`. If there are `n` `volumeTierBound`'s, then we can calculate the maximum permitted value for a price or a volume. Call this `maxLeafValue`. To avoid overflow, we need (crudely) `n * ( maxLeafValue ** 2 ) < q`. Or `maxLeafValue < sqrt(q / n)`. I.e. for all prices `p_i` and volumes `v_i`, we need `p_i, v_i < sqrt(q/n)`. There are other ways to avoid overflows instead.
  - We might not need to use all available 'rows' of the 'volume-price tiering table' for a particular MSA. For our `volumeTierBounds`. We need to prove all of the right-most unused elements are `0`. Similar for `pricesByTier`; corresponding right-most elements must be 0.
  Prove `MSACommitment == H(publicKeyBuyer, publicKeySeller, volumePriceHash, minVolume, maxVolume, accumulatedVolumeDelivered, accumulatedVolumeOrdered, typeOfGood, erc20ContractAddress, salt)`.
- Prove `accumulatedVolumeDelivered = 0`. This is an 'initial state' because we're _minting_.
- Prove `accumulatedVolumeOrdered = 0`. This is an 'initial state' because we're _minting_.

**Smart Contract's steps**:

- Check the `MSACommitment` doesn't already exist on-chain in a mapping of all MSA commitments.

- Verify the zk-SNARK

- Store the `MSACommitment` in an **MSA commitments Merkle Tree** on-chain.
Recalculate `MSARoot` (the root of the tree) on-chain.

```
MSA commitment tree
                               MSARoot
                         /               \
                    /       \         /       \
                  /   \    /   \    /   \    /   \
                MSA commitments are added to these Leaves
```

### PO process
- Based on the terms agreed upon in the preceding MSA process, POs (Purchase Orders) are issued by buyer to the supplier. Issuance of a PO by the buyer should be done in such a way that the cumulative volume input (used for determing the correct price based on net accumulated volume or ordered) and the calculation involved to derive the price are private.

- Once the `MSACommitment` is in place, the Buyer can place a purchase order (PO) against the MSA.  
- A purchase order is just a 'commitment' by the Buyer to purchase a particular volume of a good.
- Each purchase order will be of the form:
  ```
  po = {
    publicKeyBuyer,
    publicKeySeller,

    volume, // the volume being ordered under this PO

    typeOfGood,
    erc20ContractAddress,
  }
  ```
- If we give this `po` a `poId` (akin to a 'PO number'), we can store the PO in a directory of all PO's:
-
  ```
  POs[poId] = {
    constants: {
      publicKeyBuyer,
      publicKeySeller,
      volume,
      typeOfGood,
      erc20ContractAddress,
    },
    commitments: [{
      commitment,
      index,
      salt,
      preventifier,
      nullifier,
      variables: {
        accumulatedVolumeDelivered,
        accumulatedAmountOwed,
      }
    }],
    payments: {} // payment record (not discussed any more in this doc)
  }
  ```
- Notice we have added a few arrays to track variable 'private states' as they change. We'll commit to our PO, as well as the initial values of our 'private states':
-
  ```
  { accumulatedVolumeDelivered } = POs[poId].commitments[0].variables
  { accumulatedAmountOwed } = POs[poId].commitments[0].variables
  { salt } = POs[poId].commitments[0]

  POs[poId].commitments[0].commitment = H(
    publicKeyBuyer,
    publicKeySeller,
    volume,
    accumulatedVolumeDelivered,   // variable
    accumulatedAmountOwed,        // variable
    typeOfGood,
    erc20ContractAddress,
    salt                          // random
  )

  POCommitment = POs[poId].commitments[0].commitment
  ```
- We include some duplicated states from the MSA directly in this POCommitment, so that the Seller / Buyer can more easily refer to them when they make future transactions in this process. This will mean that they won't have to refer to the `MSACommitment`, and can instead refer only to the `POCommitment`. (Which means fewer hashes within the circuit; in particular, only hashes up one merkle tree are required to prove membership (existence))
- Each time we want to update one of the variable private states, we will need to nullify the PO commitment, and create a new one containing the updated variable private states (and a new random salt). I.e. we'll nullify `POs[poId].commitments[0]` and create a new `POs[poId].commitments[1]` in its place.


**Variable private states within the PO commitment**

There are some updatable values which get hashed into the MSA commitment.

- The accumulated volume delivered under each PO needs to be updated with each delivery (`accumulatedVolumeDelivered`). Using this, we'll be able to prevent more deliveries than the volume specified in the PO.
- The 'amount owed' for a particular delivery must be calculated based on the accumulated volume delivered under the MSA. This is because the price to pay for a delivery is dependent on the accumulated volume delivered already under the entire MSA (`accumulatedAmountOwed`). We track the accumulated amount owed by PO (rather than by MSA), to enable companies to internally reconcile deliveries against POs.
- The Seller might do several individual 'shipments' against a single PO. This construction allows for this.
- The Buyer might pay in several instalments. This construction allows for this.


### POCommitment mint:

```
publicInputs = [
  MsaRoot,

  POCommitment,

  oldMsaNullifier = MSAs[msaId].commitments[0].nullifier,
  newMsaCommitment = MSAs[msaId].commitments[1].commitment,
]
```
```
privateInputs = [
  secretKeyBuyer,
  publicKeySeller,
  volumePriceHash,
  minVolume,
  maxVolume,
  typeOfGood,
  erc20ContractAddress,

  oldMsaAccumulatedVolumeOrdered = MSAs[msaId].commitments[0].variables.accumulatedVolumeOrdered = 0,

  oldMsaAccumulatedVolumeDelivered = MSAs[msaId].commitments[0].variables.accumulatedVolumeDelivered = 0,

  oldMsaSalt = MSAs[msaId].commitments[0].salt,

  oldMsaCommitmentSiblingPathToMSARoot,
  oldMsaCommitmentIndex = MSAs[msaId].commitments[0].index,

  volume = POs[poId].constants.volume,

  newMsaSalt = MSAs[msaId].commitments[1].salt,

  PoSalt = POs[poId].commitments[0].salt,
]
```

**Proof steps**:
- Permission:
  - Calculate `publicKeyBuyer = H(secretKeyBuyer)` (proving permission to change states through this 'PO Mint' function as Buyer).

- Proof that the oldMsaCommitment exists on-chain:
  - Calculate `oldMSACommitment = H(...)`
  - Prove `oldMsaCommitment` is in the Merkle Tree with root `MsaRoot` using the `oldMsaCommitmentSiblingPathToMSARoot` and `oldMsaCommitmentIndex`.

- Nullify the oldMsaCommitment:
  - Calculate `oldMsaNullifierCheck = H(secretKeyBuyer || secretKeySeller, oldMsaCommitment)`
  - Prove `oldMsaNullifier == oldMsaNullifierCheck`

- Check the volume is valid:
  - `if oldMsaAccumulatedVolumeOrdered < minVolume then` prove `volume > minVolume`.
  - Prove `volume < ( maxVolume - oldMsaAccumulatedVolumeOrdered )`.

- Update private variables:
  - Calculate `newMsaAccumulatedVolumeOrdered = oldMsaAccumulatedVolumeOrdered + volume`

- New commitments:
  - Calculate `newMsaCommitmentCheck` as `H(...)`
  - Prove `newMsaCommitment == newMsaCommitmentCheck`
  - Prove `POCommitment == H(publicKeyBuyer, publicKeySeller, volume, 0, 0, typeOfGood, erc20ContractAddress, PoSalt)`


**Smart Contract's steps**:

- Check the `MsaRoot` is a valid historical root.

- Check the `oldMsaNullifier` doesn't already exist. Add it to the `MsaNullifiers` list. (We might be able to get away with a single `Nullifiers` list, if we can be confident there won't be hash collisions!)

- Check the `newMSACommitment` doesn't already exist on-chain in a mapping of all MSA commitments.

- Check the `POCommitment` doesn't already exist on-chain in a mapping of all PO commitments.

- Verify the zk-SNARK

- Store the `newMsaCommitment` in the **MSA commitments Merkle Tree**.
- Recalculate `MsaRoot` (the root of the tree) on-chain.

- Store the `POCommitment` in a **PO commitments Merkle Tree** on-chain.
- Recalculate `PoRoot` (the root of the tree) on-chain.


```
MSA commitment tree
                               MSARoot
                         /               \
                    /       \         /       \
                  /   \    /   \    /   \    /   \
                MSA commitments are added to these Leaves
```

```
PO commitment tree
                               PORoot
                         /               \
                    /       \         /       \
                  /   \    /   \    /   \    /   \
                PO commitments are added to these Leaves
```

## How can this be improved?

- Choice of the proving scheme: Groth16 has a proof malleability issue that is well understood (PGHR13 that was used previously by nightfall has also this issue). The malleability means that one can take a valid proof and maul it to another valid proof that maps to an incorrect circuit. But the attacker cannot specify what incorrect circuit the new proof is mapped to. This can be solved protocol wise by requiring the proof submitter to sign the proof so that the invalid proof is not taken into consideration. This however reveals the identity of the submitter since we need his public key to verify the signature, but we can include the signature verification inside the snark circuit making his public key a private input to the snark (requires eddsa signature over baby-jubjub curve). GM17 on the other hand doesn’t have this proof malleability issue at the cost of bigger proof size and longer verification time.
- Choice of hashing functions: Other hashing choices - Mimc, Poseidon, Pedersen

## References
- [Zero-Knowledge-Proofs] (https://zkp.science/)
- [Zokrates] (https://github.com/Zokrates/ZoKrates)
- [zk-SNARK] (https://z.cash/technology/zksnarks/)
- [EY-Nightfall] (https://github.com/EYBlockchain/nightfall)
- [Nightfall-Explainer] (https://medium.com/@chaitanyakonda/nightfall-makes-token-transactions-on-ethereum-private-how-does-it-work-acf2ffd0aa7a)
- [Arithmetic-Circuits-Explainer] (https://medium.com/web3studio/simple-explanations-of-arithmetic-circuits-and-zero-knowledge-proofs-806e59a79785)
- [Groth16](https://eprint.iacr.org/2016/260.pdf)
- [GM17](https://eprint.iacr.org/2017/540.pdf)
- [Cheap-Hash-Functions](https://ethresear.ch/t/cheap-hash-functions-for-zksnark-merkle-tree-proofs-which-can-be-calculated-on-chain/3176/10)
