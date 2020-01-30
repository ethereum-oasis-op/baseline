import React, { useEffect, useState, useContext } from 'react';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import { useParams } from 'react-router-dom';
import { useQuery, useLazyQuery } from '@apollo/react-hooks';
import moment from 'moment';
import { GET_RFP_PROPOSAL_MSA } from '../graphql/rfp';
import RadishLogo from '../components/RadishLogo';
import RFPSuppliersTable from '../components/RFPSuppliersTable';
import ProposalForm from '../components/ProposalForm';
import { GET_PARTNER_BY_IDENTITY } from '../graphql/partners';
import RateTable from '../components/RateTable';
import SKUTable from '../components/SKUTable';
import { ServerSettingsContext } from '../contexts/server-settings-context';

const RFPDetail = () => {
  const [isSender, setIsSender] = useState(false);
  const { id } = useParams();
  const { settings } = useContext(ServerSettingsContext);
  const { organizationAddress } = settings ? settings : {};
  const { loading, error, data, refetch } = useQuery(GET_RFP_PROPOSAL_MSA, {
    variables: {
      uuid: id,
    }
  });
  const [getPartnerByMessengerKey, { loading: partnerLoading, data: partnerData }] = useLazyQuery(
    GET_PARTNER_BY_IDENTITY,
  );

  useEffect(() => {
    if (data && data.rfp) {
      getPartnerByMessengerKey({ variables: { identity: data.rfp.sender } });
      getProposalsByRFPId({ variables: { rfpId: id } });
    }
  }, [data]);

  useEffect(() => {
    if (organizationAddress && partnerData) {
      partnerData.getPartnerByIdentity.address === organizationAddress && setIsSender(true);
    };
  }, [organizationAddress, partnerData]);

  if (loading || partnerLoading) return <RadishLogo loader />;

  if (!data || !data.rfp) return <h1>Not Found</h1>;

  return (
    <Container>
      <Typography variant="h4">{data.rfp.description}</Typography>
      {!isSender && partnerData && (
        <Typography variant="body1">
          for {partnerData.getPartnerByMessengerKey.name}
        </Typography>
      )}
      <Typography>
        Proposal Deadline: {moment(data.rfp.proposalDeadline * 1000).format('LL')}
      </Typography>
      <Typography variant="h2" style={{ margin: '2rem' }}>
        Items Requested
      </Typography>
      <SKUTable rfp={data.rfp} />
      {isSender && (
        <RFPSuppliersTable
          rfp={data.rfp}
          proposals={data.getProposalsByRFPId || []}
          msas={data.msasByRFP || []}
          refetch={refetch}
        />
      )}
      {!isSender && data && !data.getProposalsByRFPId.length && <ProposalForm rfp={data.rfp} />}
      {!isSender && data && data.getProposalsByRFPId.length > 0 && (
        <RateTable rates={data.getProposalsByRFPId[0].rates} />
      )}
    </Container>
  );
};

export default RFPDetail;
