import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useQuery, useMutation } from '@apollo/react-hooks';
import { GET_RFQ_UPDATE, GET_ALL_RFQS, CREATE_RFQ } from '../graphql/rfq';

const RFQContext = React.createContext([{}, () => {}]);

let listener;

const RFQProvider = ({ children }) => {
  const { subscribeToMore, loading, data, error } = useQuery(GET_ALL_RFQS);
  const [postRFQ] = useMutation(CREATE_RFQ);
  const rfqs = data ? data.rfqs : [];

  useEffect(() => {
    if (!listener) {
      listener = subscribeToMore({
        document: GET_RFQ_UPDATE,
        variables: {},
        updateQuery: (prev, { subscriptionData }) => {
          if (!subscriptionData.data) return prev;
          const { newRFQ } = subscriptionData.data;
          return { ...prev, rfqs: [newRFQ, ...prev.rfqs] };
        },
      });
    }
  }, []);

  return (
    <RFQContext.Provider value={{ rfqs, loading, error, postRFQ }}>{children}</RFQContext.Provider>
  );
};

RFQProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export { RFQContext, RFQProvider };
