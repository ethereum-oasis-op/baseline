import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useQuery, useMutation } from '@apollo/react-hooks';
import {
  GET_ALLPARTNERS_QUERY,
  ADD_PARTNER,
  REMOVE_PARTNER,
  GET_PARTNER_UPDATE,
} from '../graphql/partners';

export const PartnerContext = React.createContext();
let partnerListener;

const partnerUpdateQuery = (prev, { subscriptionData }) => {
  if (!subscriptionData.data) return prev;
  const { serverSettingsUpdate } = subscriptionData.data;
  return { prev, getServerSettings: serverSettingsUpdate };
}

export const PartnerProvider = ({ children }) => {
  const {
    subscribeToMore,
    data,
    error,
    loading,
  } = useQuery(GET_ALLPARTNERS_QUERY);

  const options = { fetchPolicy: 'no-cache' };
  const [addPartner] = useMutation(ADD_PARTNER, options);
  const [removePartner] = useMutation(REMOVE_PARTNER, options);

  useEffect(() => {
    if (!partnerListener) {
      partnerListener = subscribeToMore({
        document: GET_PARTNER_UPDATE,
        updateQuery: partnerUpdateQuery,
        fetchPolicy: 'no-cache',
      });
    }
  }, [subscribeToMore]);

  if (loading) return <h1>Loading...</h1>;
  if (error) return <h1>Error</h1>;

  return (
    <PartnerContext.Provider value={{
      partners: data.myPartners,
      organizations: data.organizations,
      addPartner,
      removePartner,
    }}>
      {children}
    </PartnerContext.Provider>
  );
};

PartnerProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
