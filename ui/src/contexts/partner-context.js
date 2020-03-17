import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useQuery, useMutation } from '@apollo/react-hooks';
import {
  GET_ALLPARTNERS_QUERY,
  ADD_PARTNER,
  REMOVE_PARTNER,
  ORGANIZATION_PARTNER_LIST_UPDATE,
  GET_ALL_ORGANIZATIONS,
  GET_PARTNERS,
} from '../graphql/partners';

export const PartnerContext = React.createContext();
let partnerListener;

const getAllOrganizationsUpdateQuery = (prev, { subscriptionData }) => {
  if (!subscriptionData.data) return prev;
  const { organizationPartnerListUpdate } = subscriptionData.data;
  const { organizations, partners } = organizationPartnerListUpdate;
  return { organizations, partners };
};

export const PartnerProvider = ({ children }) => {
  const { subscribeToMore, data, error, loading } = useQuery(GET_ALL_ORGANIZATIONS);

  console.log('PARTNER DATA:', data);
  const options = { fetchPolicy: 'no-cache' };
  const [addPartner] = useMutation(ADD_PARTNER, options);
  const [removePartner] = useMutation(REMOVE_PARTNER, options);

  useEffect(() => {
    if (!partnerListener) {
      partnerListener = subscribeToMore({
        document: ORGANIZATION_PARTNER_LIST_UPDATE,
        updateQuery: getAllOrganizationsUpdateQuery,
        fetchPolicy: 'no-cache',
      });
    }
  }, [subscribeToMore]);

  if (loading) return <h1>Loading...</h1>;
  if (error) return <h1>Error</h1>;

  return (
    <PartnerContext.Provider
      value={{
        partners: data.partners,
        organizations: data.organizations,
        addPartner,
        removePartner,
      }}
    >
      {children}
    </PartnerContext.Provider>
  );
};

PartnerProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
