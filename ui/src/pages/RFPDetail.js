import React, { useEffect } from 'react';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import { useParams } from 'react-router-dom';
import { useQuery, useLazyQuery } from '@apollo/react-hooks';
import moment from 'moment';
import { GET_RFP } from '../graphql/rfp';
import RadishLogo from '../components/RadishLogo';
import RFPSuppliersTable from '../components/RFPSuppliersTable';
import ProposalForm from '../components/ProposalForm';
import { GET_PARTNER_BY_IDENTITY } from '../graphql/partners';
import { GET_PROPOSAL_BY_RFPID } from '../graphql/proposal';
import RateTable from '../components/RateTable';

const RFPDetail = () => {
  const { id } = useParams();
  const { loading, error, data } = useQuery(GET_RFP, {
    variables: { uuid: id },
  });
  const [getPartnerByIdentity, { loading: partnerLoading, data: partnerData }] = useLazyQuery(
    GET_PARTNER_BY_IDENTITY,
  );
  const [getProposalByRFPId, { loading: proposalLoading, data: proposalData }] = useLazyQuery(
    GET_PROPOSAL_BY_RFPID,
  );

  useEffect(() => {
    if (data && data.rfp) {
      getPartnerByIdentity({ variables: { identity: data.rfp.sender } });
      getProposalByRFPId({ variables: { rfpId: id } });
    }
  }, [data]);

  const userRole = Number(localStorage.getItem('userRole')) || 1;

  if (loading || partnerLoading || proposalLoading) return <RadishLogo loader />;

  if (!data || !data.rfp) return <h1>Not Found</h1>;

  return (
    <Container>
      <Typography variant="h4">{data.rfp.description}</Typography>
      {userRole === 2 && (
        <Typography variant="body1">
          for {partnerData && partnerData.getPartnerByIdentity.name}
        </Typography>
      )}
      <Typography>
        Proposal Deadline: {moment(data.rfp.proposalDeadline * 1000).format('LL')}
      </Typography>
      <Typography variant="h2" style={{ margin: '2rem' }}>
        Items Requested
      </Typography>
      <Table style={{ margin: '2rem' }}>
        <TableHead>
          <TableRow>
            <TableCell>SKU</TableCell>
            <TableCell>Description</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow>
            <TableCell>{data.rfp.sku}</TableCell>
            <TableCell>{data.rfp.skuDescription}</TableCell>
          </TableRow>
        </TableBody>
      </Table>
      {userRole === 1 && <RFPSuppliersTable suppliers={data.rfp.recipients} />}
      {proposalData && proposalData.getProposalByRFPId ? (
        <RateTable rates={proposalData.getProposalByRFPId.rates} />
      ) : (
        userRole === 2 && <ProposalForm rfpId={id} />
      )}
    </Container>
  );
};

export default RFPDetail;
