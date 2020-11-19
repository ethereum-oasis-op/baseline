export type Commitment = {
  // currentHash = H(Underlying data/doc + salt)
  salt: string;
  // Values needed for verification (Shield.verifyAndPush inputs)
  value: string;
  proof: number[];
  publicInputs: string[];
  signatures: object; // Allows mapping from participant address -> signature
  metadata: object;
  sender: string; // Address of participant who created the commitment
};

export type Participant = {
  address: string; // Can use this to lookup messagingEndpoint, etc.
  metadata: object;
}

export type State = {

  identifier: string; // workflow identifier
  shield: string; // Shield contract address

  // Underlying document identification and location information
  persistence: {
    url: string;
    model: string; // i.e. collection, table
    id: string; // identifier, i.e. document name, UUID, primary key
    fields: string[] | string; // fields within document to hash and baseline
    metadata: object;
  };

  // Counter-parties plus self
  parties: Participant[];

  // commitments[0] is latest commitment (new commitments are prepended to array)
  commitments: Commitment[];

};
