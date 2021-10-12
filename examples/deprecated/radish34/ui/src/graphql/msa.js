import gql from 'graphql-tag';

export const MSA_ATTRIBUTES = gql`
  fragment MSA_ATTRIBUTES on MSA {
    _id
    zkpPublicKeyOfBuyer
    zkpPublicKeyOfSupplier
    whisperPublicKeySupplier
    tierBounds
    pricesByTier
    sku
    erc20ContractAddress
    hashOfTieredPricing
    minVolume
    maxVolume
    buyerSignatureStatus
    supplierSignatureStatus
    rfpId
    commitments {
      commitment
      salt
      index
      variables {
        accumulatedVolumeOrdered
        accumulatedVolumeDelivered
      }
    }
    supplierDetails {
      name
      address
      role
      identity
      zkpPublicKey
    }
  }
`;

export const GET_MSA_UPDATE = gql`
  subscription onNewMSA {
    newMSA {
      ...MSA_ATTRIBUTES
    }
  }
  ${MSA_ATTRIBUTES}
`;

export const GET_ALL_MSAS = gql`
  query getAllMSAs {
    msas {
      ...MSA_ATTRIBUTES
    }
  }
  ${MSA_ATTRIBUTES}
`;

export const CREATE_MSA = gql`
  mutation createMSA($input: inputMSA!) {
    createMSA(input: $input) {
      ...MSA_ATTRIBUTES
    }
  }
  ${MSA_ATTRIBUTES}
`;

export const GET_MSA_BY_PROPOSAL = gql`
  query getMSAByProposal($proposalId: String!) {
    msaByProposal(proposalId: $proposalId) {
      ...MSA_ATTRIBUTES
    }
  }
  ${MSA_ATTRIBUTES}
`;

export const GET_MSAS_BY_SKU = gql`
  query msasBySKU($sku: String!) {
    msasBySKU(sku: $sku) {
      ...MSA_ATTRIBUTES
    }
  }
  ${MSA_ATTRIBUTES}
`;

export const GET_MSA_BY_ID = gql`
  query msa($id: String!) {
    msa(id: $id) {
      ...MSA_ATTRIBUTES
    }
  }
  ${MSA_ATTRIBUTES}
`
