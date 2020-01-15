import React from 'react';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import { useParams } from 'react-router-dom';
import { useQuery } from '@apollo/react-hooks';
import moment from 'moment';
import uniqid from 'uniqid';
import { GET_RFP } from '../graphql/rfp'; 
import RadishLogo from '../components/RadishLogo';

const RFPDetail = () => {
  const { id } = useParams();
  const { loading, data } = useQuery(GET_RFP, {
    variables: { id: Number(id) },
  });

  if (loading) return <RadishLogo loader />

  if (!data.rfp) return <h1>Not Found</h1>

  return (
    <Container>
      <Typography variant="h4">{data.rfp.description}</Typography>
      <Typography>Proposal Deadline: {moment(data.rfp.dateDeadline).format('LL')}</Typography>
      <Typography variant="h2" style={{margin: '2rem'}}>Items Requested</Typography>
      <Table style={{margin: '2rem'}}>
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
      <Typography variant="h2" style={{margin: '2rem'}}>Suppliers</Typography>
      <Table style={{margin: '2rem'}}>
        <TableHead>
          <TableRow>
            <TableCell>Supplier</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Volume</TableCell>
            <TableCell>Price Per Unit</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.rfp.recipients.map(recipient => {
            return (
              <TableRow key={uniqid()}>
                <TableCell>{recipient.partner.name}</TableCell>
                <TableCell>{recipient.receiptDate ? `Sent: ${recipient.receiptDate}` : 'Pending'}</TableCell>
                {/* TODO: integrate 2 table cells below */}
                <TableCell>N/A</TableCell>
                <TableCell>N/A</TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </Container>
  );
};

export default RFPDetail;
