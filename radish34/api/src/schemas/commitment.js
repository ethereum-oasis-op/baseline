import gql from 'graphql-tag';

const CommitmentSchema = gql`

  type AgreementCommitment {
    commitment: String!
    nullifier: String
  }

  input PreImage {
    zkpPublicKeyOfSender: String!
    zkpPublicKeyOfRecipient: String!
    name: String!
    description: String!
    erc20ContractAddress: String!
  }

  input inputCommitment {
    constants: PreImage!
    commitment: inputAgreementCommitment!
    initType: String!
  }

  input inputAgreementCommitment {
    commitment: String!
    index: Int
    salt: String!
    nullifier: String
  } 
`;

export default CommitmentSchema;