import React, { useEffect, useContext } from 'react';
import { useLazyQuery } from '@apollo/react-hooks';
import { useParams, useHistory } from 'react-router-dom';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import moment from 'moment';
import SKUTable from '../components/SKUTable';
import MSACard from '../components/MSACard';
import POTimeline from '../components/POTimeline';
import { GET_PURCHASE_ORDER } from '../graphql/purchase-order';
import { GET_MSA_BY_ID } from '../graphql/msa';
import { ServerSettingsContext } from '../contexts/server-settings-context';

const PurchaseOrderDetail = () => {
  const history = useHistory();
  const { id } = useParams();
  const { settings } = useContext(ServerSettingsContext);
  const { organizationWhisperKey: currentUserWhisperKey } = settings ? settings : {};

  const [fetchPO, { data, loading }] = useLazyQuery(GET_PURCHASE_ORDER);
  const { po: purchaseOrder } = data || {};

  const [fetchMSA, { data: msaData }] = useLazyQuery(GET_MSA_BY_ID);
  const { msa } = msaData || {};

  useEffect(() => {
    if (!purchaseOrder) fetchPO({ variables: { id } });
    else if (purchaseOrder && !msa) fetchMSA({ variables: { id: purchaseOrder.metadata.msaId } });
  }, [id, fetchPO, purchaseOrder, fetchMSA, msa]);

  if (loading) return 'Loading...';
  if (!loading && !purchaseOrder) return 'Not Found';

  return (
    <Container>
      <Typography variant="h2">Purchase Order for SKU: {purchaseOrder.constants.sku}</Typography>
      <Typography variant="subtitle1">{purchaseOrder.metadata.description}</Typography>
      <Typography variant="overline">Delivery Date: {moment(purchaseOrder.metadata.deliveryDate * 1000).format('MM/DD/YYYY')}</Typography>
      <div style={{ marginTop: '2.5rem' }}>
        <Typography variant="h3">Items Requested</Typography>
        <SKUTable sku={purchaseOrder.constants.sku} volume={purchaseOrder.constants.volume} />
      </div>
      <Grid container direction="row">
        <Grid item xs={4}>
          {msa && <MSACard msa={msa} price={purchaseOrder.constants.price} onClick={() => history.push(`/contracts/${msa._id}`)} />}
        </Grid>
        <Grid item xs={8}>
          <POTimeline isSender={currentUserWhisperKey !== purchaseOrder.whisperPublicKeyOfSupplier} />
        </Grid>
      </Grid>
    </Container>
  );
};

export default PurchaseOrderDetail;
