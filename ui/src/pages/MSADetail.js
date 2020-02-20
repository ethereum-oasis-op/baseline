import React, { useEffect, useContext, useState } from 'react';
import { useLazyQuery } from '@apollo/react-hooks';
import { useParams } from 'react-router-dom';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import SKUTable from '../components/SKUTable';
import RateTable from '../components/RateTable';
import Signatures from '../components/Signatures';
import ApproveFooter from '../components/ApproveFooter';
import { GET_MSA_BY_ID } from '../graphql/msa';
import { GET_RFP } from '../graphql/rfp';
import { GET_PROPOSAL } from '../graphql/proposal';
import { GET_PARTNER_BY_IDENTITY } from '../graphql/partners';
import { ServerSettingsContext } from '../contexts/server-settings-context';

const MSADetail = () => {
  const { id } = useParams();
  const [isSender, setIsSender] = useState(true);
  const [fetchMSA, { data: msaData, loading: msaLoading }] = useLazyQuery(GET_MSA_BY_ID);
  const { msa } = msaData || {};

  const [fetchRFP, { data: rfpData, loading: rfpLoading }] = useLazyQuery(GET_RFP);
  const { rfp } = rfpData || {};

  const [fetchProposal, { data: proposalData, loading: proposalLoading }] = useLazyQuery(GET_PROPOSAL);
  const { proposal } = proposalData || {};

  const [getPartnerByIdentity, { data: partnerData, loading: partnerLoading }] = useLazyQuery(
    GET_PARTNER_BY_IDENTITY,
  );
  const { getPartnerByIdentity: partner } = partnerData || {};
  const { name, address } = partner || {};

  const { settings } = useContext(ServerSettingsContext);
  const { organizationAddress } = settings ? settings : {};

  useEffect(() => {
    if (!msa) {
      fetchMSA({ variables: { id } });
    };
    if (msa) {
      fetchRFP({ variables: { uuid: msa.rfpId } });
      fetchProposal({ variables: { id: msa.proposalId } });
    };
  }, [fetchMSA, msa]);

  useEffect(() => {
    if (organizationAddress && address) {
      address === organizationAddress ? setIsSender(true) : setIsSender(false);
    };
  }, [organizationAddress, address]);

  useEffect(() => {
    if (rfp) getPartnerByIdentity({ variables: { identity: rfp.sender } });
  }, [getPartnerByIdentity, rfp]);

  if (!msaData) return 'Not Found';

  return (
    <Container>
      {rfp && <Typography variant='h2'>{rfp.description}</Typography>}
      {partner && <Typography>{name}</Typography>}
      {rfp && <SKUTable rfp={rfp} />}
      <Grid container>
        {proposal &&
          <>
            <Grid item>
              <RateTable rates={proposal.rates} erc20ContractAddress={proposal.erc20ContractAddress} />
            </Grid>
            <Grid item style={{ marginLeft: '10rem' }}>
              <Typography variant="h3">Conditions</Typography>
              <Typography>None</Typography>
            </Grid>
          </>
        }
      </Grid>
      {/* TODO: integrate Signatures component with backend */}
      <Signatures />
      {/* only show approve footer if current user has not already signed */}
      {!isSender && <ApproveFooter onClick={() => console.log('hello')} />}
    </Container>
  );
}

export default MSADetail;
