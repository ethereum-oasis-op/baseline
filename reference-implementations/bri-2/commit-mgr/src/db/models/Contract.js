import { Schema, model } from "mongoose";

// This schema stores information relating to each node of the tree. Note that a leaf shares this same schema.
const contractSchema = new Schema({
    name: String, // Contract name
    network: String, // Contract network
    blockNumber: Number, // Last interation block number
    txHash: String, // Tx Hash
    address: String, // contract address
    active: Boolean
  });

// Automatically generate createdAt and updatedAt fields
contractSchema.set('timestamps', true);

export const contractBaseline = model('contract-baseline', contractSchema);
