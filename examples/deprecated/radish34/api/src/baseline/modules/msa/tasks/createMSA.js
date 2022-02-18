export default [
  {
    description: 'saves msa to database',
    requires: ['proposalId', 'buyerSignature', 'supplierSignature'],
    provides: ['msaId'],
    resolver: 'createMSAInDB',
    resolverOptions: { option: 'value' },
  },
  {
    description: 'signs the msa with a salt',
    requires: ['payload'],
    provides: ['msaId'],
    resolver: 'signCommitment',
  },
  {
    description: 'asks the zkp service to generate a proof with the provided payload',
    requires: ['msaId'],
    provides: ['customResponse'],
    resolver: 'customFunc',
    resolverOptions: { circuit: 'msa', repeat: false, entagle: true },
  },
];
