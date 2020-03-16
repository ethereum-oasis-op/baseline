import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useQuery, useMutation } from '@apollo/react-hooks';
import { GET_RFP_UPDATE, GET_ALL_RFPS, CREATE_RFP } from '../graphql/rfp';

const RFPContext = React.createContext([{}, () => {}]);

let listener;

const RFPProvider = ({ children }) => {
  const { subscribeToMore, loading, data, error } = useQuery(GET_ALL_RFPS);
  const [postRFP] = useMutation(CREATE_RFP);
  const rfps = data ? data.rfps : [];

  useEffect(() => {
    if (!listener) {
      listener = subscribeToMore({
        document: GET_RFP_UPDATE,
        variables: {},
        updateQuery: (prev, { subscriptionData }) => {
          if (!subscriptionData.data) return prev;
          const { newRFP } = subscriptionData.data;
          return { ...prev, rfps: [newRFP, ...prev.rfps] };
        },
      });
    }
  }, [subscribeToMore]);

  return (
    <RFPContext.Provider value={{ rfps, loading, error, postRFP }}>{children}</RFPContext.Provider>
  );
};

RFPProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export { RFPContext, RFPProvider };
