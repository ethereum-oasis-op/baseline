import React from 'react';
import Typography from '@material-ui/core/Typography';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import Button from '@material-ui/core/Button';
import uniqid from 'uniqid';
import find from 'lodash/find';
import { formatCurrency } from '../utils';

const RFPSuppliersTable = ({ rfp, proposals }) => {
  const recipients = rfp.recipients.map(recipient => {
    const recipientProposal = find(
      proposals,
      proposal => proposal.sender === recipient.partner.identity,
    );
    return { ...recipient, ...recipientProposal };
  });

  const createContract = () => {
    console.log('approved, redirecting to contract creation page');
    //TODO: redirect to a new page? open a modal?
  };

  return (
    <>
      <Typography variant="h2" style={{ margin: '2rem' }}>
        Suppliers
      </Typography>
      <Table style={{ margin: '2rem' }}>
        <TableHead>
          <TableRow>
            <TableCell>Supplier</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Volume</TableCell>
            <TableCell>Price Per Unit</TableCell>
            <TableCell />
          </TableRow>
        </TableHead>
        <TableBody>
          {recipients.map(recipient => {
            return (
              <TableRow key={uniqid()}>
                <TableCell>{recipient.partner.name}</TableCell>
                <TableCell>
                  {recipient.receiptDate ? `Sent: ${recipient.receiptDate}` : 'Pending'}
                </TableCell>
                <TableCell>
                  {recipient.rates &&
                    recipient.rates.map(rate => (
                      <Typography>{`${rate.startRange}-${rate.endRange}`}</Typography>
                    ))}
                </TableCell>
                <TableCell>
                  {recipient.rates &&
                    recipient.rates.map(rate => (
                      <Typography>{`${formatCurrency(rate.price)}`}</Typography>
                    ))}
                </TableCell>
                <TableCell>
                  {recipient.rates && (
                    <Button variant="primary" onClick={() => createContract()}>
                      Approve
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </>
  );
};

export default RFPSuppliersTable;
