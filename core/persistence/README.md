# @baseline-protocol/persistence

This package is under development for a future release. When complete, it will facilitate connection to systems of record, i.e. databases. This package is not required for implementation of the Baseline Protocol v0.1.

## Installation

`npm install @baseline-protocol/persistence`

## Building

You can build the package locally with `npm run build`.

## Baseline State Tracking

```typescript
BaselineState: {
  
  // Underlying document identification and location information
  offchainLocation: {
    dbUrl: String,
    collectionName: String,
    documentId: String, // UUID,
    baselinedFields: String[],
  }

  // Counter-parties
  counterParties: [{
    messagingEndpoint: String,
    name: String,
    currentHash: String
  }],

  // Possible states:
  // 1: based: currentHash === on-chain commitment
  // 2. debased: currentHash !== on-chain commitment
  currentState: String,
  
  // currentHash = H(Underlying data/doc + salt)
  currentHash: String,
  salt: String, 

  // On-chain location
  commitmentLocation: {
    shieldAddress: String,
    leafIndex: Number,
    blockNumber: Number
  }

  // Values needed for verification
  commitmentDetails: {
    value: String,
    proof: Number[],
    publicInputs: String[],
  }

}
```
