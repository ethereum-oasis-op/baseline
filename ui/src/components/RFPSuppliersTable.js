import React, { useState, useContext } from 'react';
import Typography from '@material-ui/core/Typography';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import Button from '@material-ui/core/Button';
import uniqid from 'uniqid';
import find from 'lodash/find';
import CreateContract from './CreateContract';
import Link from './Link';
import { formatCurrency } from '../utils';
import { MSAContext } from '../contexts/msa-context';

const RFPSuppliersTable = ({ rfp, proposals, msas, refetch }) => {
  const { postMSA } = useContext(MSAContext);
  const [open, setOpen] = useState({});

  const recipientProposals = rfp.recipients.map(recipient => {
    const recipientProposal = find(
      proposals,
      proposal => proposal.sender === recipient.partner.identity,
    ) || {};
    const msa = find(msas, msa => msa.proposalId === recipientProposal._id) || {};
    return { ...recipient, ...recipientProposal, msaId: msa._id };
  });

  const createContract = async (rfpId, proposalId, recipient, index) => {
    await postMSA({
      variables: {
        input: {
          rfpId,
          proposalId,
          recipient,
        },
      },
    });
    setOpen({ [index]: false });
    refetch();
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
          {recipientProposals.map((proposal, index) => {
            return (
              <TableRow key={uniqid()}>
                <TableCell>{proposal.partner.name}</TableCell>
                <TableCell>
                  {/* {proposal.receiptDate ? `Sent: ${proposal.receiptDate}` : 'Pending'} */}
                  Sent
                </TableCell>
                <TableCell>
                  {proposal.rates &&
                    proposal.rates.map((rate, i) => (
                      <Typography key={uniqid()}>
                        {`${rate.startRange}-${rate.endRange}${proposal.rates[i + 1] ? '' : '+'}`}
                      </Typography>
                    ))}
                </TableCell>
                <TableCell>
                  {proposal.rates &&
                    proposal.rates.map(rate => (
                      <Typography key={uniqid()}>{`${formatCurrency(rate.price)}`}</Typography>
                    ))}
                </TableCell>
                <TableCell>
                  {proposal.rates &&
                    (proposal.msaId ? (
                      <Link to={`/contracts/${proposal.msaId}`}>View Contract</Link>
                    ) : (
                      <Button
                        variant="contained"
                        style={{ color: '#fff', background: 'blue' }}
                        onClick={() => setOpen({ [index]: true })}
                      >
                        Create Contract
                      </Button>
                    ))}
                </TableCell>
                <CreateContract
                  rfp={rfp}
                  proposal={proposal}
                  open={open[index]}
                  handleClose={() => setOpen({ [index]: false })}
                  createContract={() => createContract(rfp._id, proposal._id, proposal.sender, index)}
                />
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </>
  );
};

export default RFPSuppliersTable;
