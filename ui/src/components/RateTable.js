import React from 'react';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import Typography from '@material-ui/core/Typography';
import GreaterThanIcon from './GreaterThanIcon';
import { formatCurrency } from '../utils';

const RateTable = ({ proposals }) => {
  return (
    <>
      <Typography variant="h3">Pricing</Typography>
      <Table style={{ margin: '2rem' }}>
        <TableHead>
          <TableRow>
            <TableCell>Volume</TableCell>
            <TableCell>Price</TableCell>
            <TableCell>Unit Of Measure</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {proposals.map(proposal =>
            proposal.rates.map(rate => (
              <TableRow>
                <TableCell>
                  <GreaterThanIcon />
                  {rate.endRange}
                </TableCell>
                <TableCell>{formatCurrency(rate.price)}</TableCell>
                <TableCell>{rate.unitOfMeasure}</TableCell>
              </TableRow>
            )),
          )}
        </TableBody>
      </Table>
    </>
  );
};

export default RateTable;
