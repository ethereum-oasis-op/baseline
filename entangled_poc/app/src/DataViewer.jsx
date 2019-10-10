import React from 'react';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import { Box } from '@material-ui/core';
import RfqEditor from './RfqEditor';

export const GET_RFQS = gql`
  query GetRFQs {
    rfqs {
      _id
      refNum
      itemQty
    }
  }
`;

export const UPDATE_RFQ = gql`
  mutation($_id: ID, $itemQty: Int) {
    updateRfq(_id: $_id, input: { itemQty: $itemQty }) {
      _id
      refNum
      itemQty
    }
  }
`;

const DataViewer = () => {
  return (
    <Query query={GET_RFQS}>
      {({ loading, data }) =>
        !loading && (
          <Box>
            {data.rfqs.map(rfq => (
              <RfqEditor rfq={rfq} key={rfq._id} />
            ))}
          </Box>
        )
      }
    </Query>
  );
};

export default DataViewer;
