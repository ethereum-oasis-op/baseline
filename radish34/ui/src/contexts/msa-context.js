import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useQuery, useMutation } from '@apollo/react-hooks';
import { GET_MSA_UPDATE, GET_ALL_MSAS, CREATE_MSA } from '../graphql/msa';

const MSAContext = React.createContext([{}, () => {}]);

let listener;

const MSAProvider = ({ children }) => {
  const { subscribeToMore, loading, data, error } = useQuery(GET_ALL_MSAS);
  const [postMSA] = useMutation(CREATE_MSA);
  const msas = data ? data.msas : [];

  useEffect(() => {
    if (!listener) {
      listener = subscribeToMore({
        document: GET_MSA_UPDATE,
        variables: {},
        updateQuery: (prev, { subscriptionData }) => {
          if (!subscriptionData.data) return prev;
          const { newMSA } = subscriptionData.data;
          return { ...prev, msas: [newMSA, ...prev.msas] };
        },
      });
    }
  }, [subscribeToMore]);

  return (
    <MSAContext.Provider value={{ msas, loading, error, postMSA }}>{children}</MSAContext.Provider>
  );
};

MSAProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export { MSAContext, MSAProvider };
