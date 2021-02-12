import { Schema, model } from "mongoose";

// This schema stores information relating to each node of the tree. Note that a leaf shares this same schema.
const phonebookSchema = new Schema({
    name: String, // entity name
    network: String, // did network
    domain: String, // did domain
    dididentity: String, // did identity
    status: String, // did verification status
    active: Boolean
  });

// Automatically generate createdAt and updatedAt fields
phonebookSchema.set('timestamps', true);

export const phonebookBaseline = model('phonebook-baseline', phonebookSchema);
