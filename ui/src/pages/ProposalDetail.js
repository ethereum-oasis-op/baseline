import React, { useContext, useState } from 'react';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import Button from '@material-ui/core/Button';
import { useParams, useHistory } from 'react-router-dom';
import { useQuery } from '@apollo/react-hooks';
import moment from 'moment';
import uniqid from 'uniqid';
import NoticeLayout from '../components/NoticeLayout';
import Signatures from '../components/Signatures';
import { GET_PROPOSAL } from '../graphql/proposal';
import { formatCurrency } from '../utils';
import { MSAContext } from '../contexts/msa-context';
import { GET_MSA_BY_PROPOSAL } from '../graphql/msa';

const ProposalDetail = () => {
  const { id } = useParams();
  const history = useHistory();
  const { loading, data } = useQuery(GET_PROPOSAL, {
    variables: { id: id },
  });
  const { data: msa } = useQuery(GET_MSA_BY_PROPOSAL, {
    variables: { proposalId: id },
  });

  const msaData = msa ? msa.msaByProposal : {};

  const proposal = data ? data.proposal : {};
  const { postMSA } = useContext(MSAContext);
  const [postError, setPostError] = useState(null);

  if (loading) return <h1>Loading</h1>;
  if (!data.proposal) return <h1>Not Found</h1>;

  const approveProposal = async () => {
    try {
      await postMSA({
        variables: {
          input: {
            rfpId: proposal.rfpId,
            proposalId: id,
          },
        },
      });
      history.push('/notices/outbox');
    } catch (e) {
      setPostError(e.message.split(':')[1]);
    }
  };

  return (
    <NoticeLayout selected="proposal">
      <Container>
        <h1>Proposal for RFP {proposal.rfpId}</h1>
        <Typography>
          Termination Date: {moment(proposal.terminationDate).format('MM/DD/YYYY')}
        </Typography>
        <h3>Rate Table</h3>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Volume</TableCell>
              <TableCell>Price Per Unit</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {proposal.rates.map(rate => {
              return (
                <TableRow key={uniqid()}>
                  <TableCell>
                    {rate.startRange} - {rate.endRange}
                  </TableCell>
                  <TableCell>{formatCurrency(rate.ppu)}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
        {!msaData || !Object.keys(msaData).length ? (
          <>
            <Button onClick={() => approveProposal()}>Accept</Button>
            <Button>Reject</Button>
          </>
        ) : (
          <Signatures
            buyerSignature={msaData.buyerSignature}
            supplierSignature={msaData.supplierSignature}
          />
        )}
        {postError && <Typography>{postError}</Typography>}
      </Container>
    </NoticeLayout>
  );
};

export default ProposalDetail;
