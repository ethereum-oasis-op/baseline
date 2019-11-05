import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { useQuery, useMutation } from '@apollo/react-hooks';

export const PartnerContext = React.createContext();

export const GET_ALLPARTNERS_QUERY = gql`
  query {
    organizations {
      name
      address
      role
    }

    myPartners {
      name
      address
      role
    }
  }
`;

export const GET_PARTNER_QUERY = gql`
  query partner($address: Address!) {
    partner {
      name
      address
      role
    }
  }
`;

export const GET_MYPARTNERS_QUERY = gql`
  query myPartners {
    name
    address
    role
  }
`;

export const ADD_PARTNER = gql`
  mutation addPartner($input: AddPartnerInput!) {
    addPartner(input: $input) {
      partner {
        name
        address
        role
      }
    }
  }
`;

export const REMOVE_PARTNER = gql`
  mutation removePartner($input: RemovePartnerInput!) {
    removePartner(input: $input) {
      partner {
        name
        address
        role
      }
    }
  }
`;

export const PartnerProvider = ({ children }) => {
  const { data, loading, error } = useQuery(GET_ALLPARTNERS_QUERY, {
    pollInterval: 100,
  });
  const [postPartner] = useMutation(ADD_PARTNER);
  const [deletePartner] = useMutation(REMOVE_PARTNER);

  if (loading) return <h1>Loading...</h1>;
  if (error) return <h1>Error</h1>;

  return (
    <PartnerContext.Provider value={{ data, postPartner, deletePartner }}>
      {children}
    </PartnerContext.Provider>
  );
};

PartnerProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
