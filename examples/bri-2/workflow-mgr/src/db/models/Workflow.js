import { Schema, model } from "mongoose";

const workflowSchema = new Schema({
    _id: String,
    merkleId: String, // merkle-tree/Shield contract address where commitments are stored on-chain
    description: String,
    participants: [ String ], // uuids of orgs we are baselining with
    zkCircuits: [ { circuitId: String, description: String } ],
    currentState: Number, // which workstep/zkCircuit are we on? Indicates the logic the next commitment needs to satisfy
    clientType: String, // What app created this workflow (i.e. dashboard-test, Excel, Google Sheets, SAP, D365, etc.)
    status: String // 'created', 'invited', 'contracts-deployed', 'active', 'completed'
  });

// Automatically generate createdAt and updatedAt fields
workflowSchema.set('timestamps', true);

export const workflows = model('workflows', workflowSchema);
