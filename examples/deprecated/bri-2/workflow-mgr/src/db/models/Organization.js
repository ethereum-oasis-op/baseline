import { Schema, model } from "mongoose";

// This schema stores information relating to each node of the tree. Note that a leaf shares this same schema.
const organizationSchema = new Schema({
    _id: String,
    name: String, // entity name
    didUri: String, // Format: did:method:method-specific-identifier
    messengerUrl: String,
    signingKey: String, // did identity
    status: String, // did verification status
    active: Boolean
  });

// Automatically generate createdAt and updatedAt fields
organizationSchema.set('timestamps', true);

export const organizations = model('organizations', organizationSchema);
