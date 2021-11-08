import { Schema, model } from 'mongoose';

// This schema stores information relating to each node of the tree. Note that a leaf shares this same schema.
const commitSchema = new Schema(
  {
    _id: String, // uuid
    merkleId: String, // uuid of merkle-tree (same as Shield contract address)
    workflowId: String, // uuid of parent workflow
    zkCircuitId: String, // uuid of zk circuit used for to verify this commit
    salt: String, // random string for entropy
    rawData: Object, // data used to create the hash (i.e. hash's preimage)
    hashValue: String, // Commit value = H(salt + rawData)
    location: Number, // leaf index in merkle tree
    proofRawBytes: String,
    proofSolidity: {
      a: [String],
      b0: [String],
      b1: [String],
      c: [String]
    },
    publicInputs: [String],
    workflowStep: Number,
    txHash: String,
    creator: String, // i.e. Alice Eth address
    participants: [
      // Loop through this array to help determine state of commit
      {
        _id: false,
        self: Boolean,
        uuid: String,
        description: String,
        signingKey: String,
        signingKeyType: String,
        signature: String // Performed by 'signingKey' on top of 'hashValue'
      }
    ],
    /***********************************************************/
    /********      Possible "status" values            *********
     
     [success-create]
     [success-send-participants] || [fail-send-participants]
     [success-fully-signed]      || [fail-fully-signed]
     [success-proof-request]
     [success-generate-proof]    || [fail-generate-proof]
     [success-send-on-chain]     || [fail-send-on-chain]
     [success-arrive-on-chain]   || [fail-arrive-on-chain]
    ************************************************************/
    status: String
  },
  { versionKey: false }
);

// Automatically generate createdAt and updatedAt fields
commitSchema.set('timestamps', true);

export const commits = model('commits', commitSchema);
