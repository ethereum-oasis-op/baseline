import { Schema, model } from "mongoose";

// This schema stores information relating to each node of the tree. Note that a leaf shares this same schema.
const commitSchema = new Schema(
  {
    _id: String, // uuid
    merkleId: String, // uuid of merkle-tree
    workflowId: String, // uuid of parent workflow
    salt: String, // random string for entropy.
    rawData: Object, // data used to create the hash
    value: String, //  Commit value = H(rawData + salt)
    location: Number, // leaf index in merkle tree
    proof: [ Number ], // can use any three numbers for now
    publicInputs: [ String ],
    workflowStep: Number,
    txHash: String,
    creator: String, // i.e. Alice Eth address
    signatures: Object, // mapping from participant id -> signature
    status: String, // 'created', 'signed', 'layer-2', 'sent-mainnet', 'mainnet'
  },
  { versionKey: false }
);

// Automatically generate createdAt and updatedAt fields
commitSchema.set('timestamps', true);

export const commits = model('commits', commitSchema);
