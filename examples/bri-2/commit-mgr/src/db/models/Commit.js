import { Schema, model } from 'mongoose';

// This schema stores information relating to each node of the tree. Note that a leaf shares this same schema.
const commitSchema = new Schema(
  {
    _id: String, // uuid
    merkleId: String, // uuid of merkle-tree (same as Shield contract address)
    workflowId: String, // uuid of parent workflow
    salt: String, // random string for entropy
    rawData: Object, // data used to create the hash (i.e. hash's preimage)
    hashValue: String, // Commit value = H(rawData + salt)
    location: Number, // leaf index in merkle tree
    proof: [Number], // can use any three numbers for now
    publicInputs: [String],
    workflowStep: Number,
    txHash: String,
    creator: String, // i.e. Alice Eth address
    participants: [
      // Loop through this array to help determine state of commit
      {
        self: Boolean,
        uuid: String,
        signingKey: String,
        signingKeyType: String,
        signature: String // Performed by 'signingKey' on top of 'hashValue'
      }
    ],
    status: String // 'created', 'self-signed', 'sent-to-participants', 'fully-signed', 'sent-to-chain', 'confirmed-on-chain'
  },
  { versionKey: false }
);

// Automatically generate createdAt and updatedAt fields
commitSchema.set('timestamps', true);

export const commits = model('commits', commitSchema);
