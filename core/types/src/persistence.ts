export type BaselineCommitment = {
  // currentHash = H(Underlying data/doc + salt)
  salt: string;
  // Values needed for verification (Shield.verifyAndPush inputs)
  value: string;
  proof: number[];
  publicInputs: string[];
  signatures: object;
};

export type BaselineState = {

  identifier: string; // workflow identifier
  shield: string; // Shield contract address

  // Underlying document identification and location information
  persistence: {
    url: string;
    model: string; // i.e. collection, table
    id: string; // identifier, i.e. document name, UUID, primary key
    fields: string[] | string; // fields within document to hash and baseline
  };

  // Counter-parties plus self
  parties: [{
    address: string; // Can use this to lookup messagingEndpoint, etc.
    metadata: object;
  }];

  // commitments[0] is latest commitment (new commitments are prepended to array)
  commitments: BaselineCommitment[];

};
