const workflow = {
  "shield": "0x1234567890", // shield contract address where we push commitments on-chain
  "zkCircuit": "6b72d1a2-60a9-4dc7-8984-b79031e312de", // UUID of circuit created by zkp-mgr
  "commitments": [
    {
      "location": 1, // leaf index in merkle tree
      "salt": "random-string-for-entropy",
      "proof": [0, 1, 2], // can use any three numbers for now
      "publicInputs": ["0xcommitmentvalue"],
      "value": "0xcommitmentvalue", // same as our public input for now
      "sender": "0xALICEETHADDRESS",
      "signatures": {
        "0xALICEETHADDRESS": "0xALICEZKPSIG",
        "0xBOBETHADDRESS": "0xBOBZKPSIG"
      },
      "hashInput": "/path/to/preimage/fileOrObject"
    },
    {
      "location": 0, // leaf index in merkle tree
      "salt": "random-string-for-entropy",
      "proof": [0, 1, 2], // can use any three numbers for now
      "publicInputs": ["0xcommitmentvalue"],
      "value": "0xcommitmentvalue", // same as our public input for now
      "sender": "0xALICEETHADDRESS",
      "signatures": {
        "0xALICEETHADDRESS": "0xALICESIG",
        "0xBOBETHADDRESS": "0xBOBSIG"
      },
      "preImage": "/path/to/preimage/file" // How do we know which data fields are baselined? Assume entire document?
    }
  ],
  "participants": [ // who are we baselining with?
    {
      "address": "0xALICEETHADDRESS",
      "url": "nats://alice-nats:4222",
      "metadata": {
        "description": "Alice Corp"
      }
    },
    {
      "address": "0xBOBSETHADDRESS",
      "url": "nats://bob-nats:4222",
      "metadata": {
        "description": "Bob Corp"
      }
    }
  ],
  "persistence": {
    "name": "purchase-orders",
    "fields": ["A3", "B5"], // cells to baseline
    "store": {
      "provider": "excel",
      "url": "/path/to/document",
      "identifier": "document_name.xlsx",
      "metadata": {
        "description": "2021Q1 Purchase Orders with Bob Corp"
      }
    }
  }
}
