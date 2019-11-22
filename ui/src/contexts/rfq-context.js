import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useQuery } from '@apollo/react-hooks';
import { GET_RFQ_UPDATE, GET_ALL_RFQS } from '../graphql/rfq';

const RFQContext = React.createContext([{}, () => {}]);

const RFQProvider = ({ children }) => {
  const { subscribeToMore, loading, data, error } = useQuery(GET_ALL_RFQS);
  const rfqs = data ? data.rfqs : [];

  useEffect(() => {
    subscribeToMore({
      document: GET_RFQ_UPDATE,
      variables: {},
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData.data) return prev;
        const { newRFQ } = subscriptionData.data;
        return { ...prev, rfqs: [newRFQ, ...prev.rfqs] };
      },
    });
  }, []);

  return <RFQContext.Provider value={{ rfqs, loading, error }}>{children}</RFQContext.Provider>;
};

RFQProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export { RFQContext, RFQProvider };
