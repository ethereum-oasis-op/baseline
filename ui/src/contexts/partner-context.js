import React, { useState } from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag'
import { useQuery, useLazyQuery } from '@apollo/react-hooks';

//const { Provider, Consumer } = React.createContext();
export const PartnerContext = React.createContext();

// const GET_ORGANIZATIONS_QUERY = gql`
//   query GetOrganizations{
//     organizations {
//       name
//       address
//       role
//     }
//   }
// `

// const GET_ORGANIZATIONS_QUERY = gql`
//   {
//     organizations {
//       name
//       address
//       role
//     }
//   }
// `;

export const loadPartners = () => {
  const partners = [];
  return partners;
};

export const PartnerProvider = ({ children }) => {
  const [partners, setPartners] = useState(loadPartners());
  // const { called, loading, data } = useQuery(GET_ORGANIZATIONS_QUERY);
  // const [{ called, loading, data }] = useLazyQuery(GET_ORGANIZATIONS_QUERY);

  // console.log('ORGANIZATIONS', called, loading, data)

  const update = partnerList => {
    setPartners(partnerList);
  };

  return <PartnerContext.Provider value={{ partners, update }}>{children}</PartnerContext.Provider>;
};

PartnerProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

// export { Consumer as PartnerConsumer };
