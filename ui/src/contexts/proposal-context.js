import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useQuery, useMutation } from '@apollo/react-hooks';
import { GET_PROPOSAL_UPDATE, GET_ALL_PROPOSALS, CREATE_PROPOSAL } from '../graphql/proposal';

const ProposalContext = React.createContext([{}, () => {}]);

let listener;

const ProposalProvider = ({ children }) => {
  const { subscribeToMore, loading, data, error } = useQuery(GET_ALL_PROPOSALS);
  const [postProposal] = useMutation(CREATE_PROPOSAL);
  const proposals = data ? data.proposals : [];

  useEffect(() => {
    if (!listener) {
      listener = subscribeToMore({
        document: GET_PROPOSAL_UPDATE,
        variables: {},
        updateQuery: (prev, { subscriptionData }) => {
          if (!subscriptionData.data) return prev;
          const { newProposal } = subscriptionData.data;
          return { ...prev, proposals: [newProposal, ...prev.proposals] };
        },
      });
    }
  }, [subscribeToMore]);

  return (
    <ProposalContext.Provider value={{ proposals, loading, error, postProposal }}>{children}</ProposalContext.Provider>
  );
};

ProposalProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export { ProposalContext, ProposalProvider };
