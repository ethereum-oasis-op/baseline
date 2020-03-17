import React, { useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useQuery, useLazyQuery, useSubscription } from '@apollo/react-hooks';
import { GET_RFP_DELIVERED_DATE, NEW_RFP_DELIVERY_RECEIPT_UPDATE } from '../graphql/rfp';
import { GET_PARTNER_BY_IDENTITY } from '../graphql/partners';
import { GET_PROPOSAL_BY_RFPID_FOR_SUPPLIER } from '../graphql/proposal';
import NewRateTable from './NewRateTable';

const useStyles = makeStyles(() => ({
  row: {
    border: '1px solid silver',
    margin: '2rem',
    padding: '2rem',
  },
}));

const Loading = () => <div>:::Loading:::</div>;

const SupplierProposalRow = props => {
  const { rfp, supplierIdentity } = props;
  const classes = useStyles();

  console.log('SUPPLIER IDENTITYTYTYTYT', supplierIdentity);

  const { loading: partnerLoading, data: partnerData } = useQuery(GET_PARTNER_BY_IDENTITY, {
    variables: { identity: supplierIdentity },
  });

  const { loading: proposalLoading, data: proposalData } = useQuery(
    GET_PROPOSAL_BY_RFPID_FOR_SUPPLIER,
    {
      variables: { rfpId: rfp._id, supplierId: supplierIdentity },
    },
  );

  const {
    loading: loadingDeliveredDate,
    data: deliveredDateData,
    subscribeToMore: subscribeToDeliveryDateReceipt,
  } = useQuery(GET_RFP_DELIVERED_DATE, {
    variables: { docId: rfp._id, recipientId: supplierIdentity },
  });

  // const { data: subscribeToDeliveryDateReceipt, loading } = useSubscription(NEW_RFP_DELIVERY_RECEIPT_UPDATE, {
  //   variables: {
  //     docId: rfp._id,
  //     recipientId: supplierIdentity,
  //   },
  // });

  useEffect(() => {
    subscribeToDeliveryDateReceipt({
      document: NEW_RFP_DELIVERY_RECEIPT_UPDATE,
      variables: {
        docId: rfp._id,
        recipientId: supplierIdentity,
      },
    });
  }, [subscribeToDeliveryDateReceipt]);

  console.log({
    partnerLoading,
    partnerData,
    deliveredDateData,
    proposalLoading,
    proposalData,
    // loadingDeliveredDate,
    // deliveredDate,
    // loading,
  });

  return (
    <div className={classes.row}>
      {/* {partnerLoading && partnerData && partnerData.partner ? <Loading /> : <div>{partnerData.partner.name}</div>} */}
      {loadingDeliveredDate ? (
        <Loading />
      ) : (
        <div>{deliveredDateData && deliveredDateData.deliveredDate ? 'Sent' : 'Pending'}</div>
      )}
      {proposalLoading ? (
        <Loading />
      ) : (
        <NewRateTable proposal={proposalData.proposal ? proposalData.proposal : {}} />
      )}
    </div>
  );
};

export default SupplierProposalRow;
