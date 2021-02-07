import { Schema, model } from "mongoose";

// This schema stores information relating to each node of the tree. Note that a leaf shares this same schema.
const commitmentSchema = new Schema({
    commitHash: String, // Sha256 hash of new commitment
    commitment: String, // did network
    network: String // always local network *TODO
  });

// Automatically generate createdAt and updatedAt fields
commitmentSchema.set('timestamps', true);

export const commitmentBaseline = model('commitment-baseline', commitmentSchema);
