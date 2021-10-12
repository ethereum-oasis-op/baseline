import React from 'react';
import PropTypes from 'prop-types';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import Typography from '@material-ui/core/Typography';
import uniqid from 'uniqid';
import GreaterThanIcon from './GreaterThanIcon';
import { formatCurrency } from '../utils';

const RateTable = ({ rates, erc20ContractAddress }) => {
  return (
    <>
      <Typography variant="h3">Pricing</Typography>
      <Table style={{ margin: '2rem 0 2rem 0' }}>
        <TableHead>
          <TableRow>
            <TableCell>Volume</TableCell>
            <TableCell>Price</TableCell>
            <TableCell>Payment Token</TableCell>
            <TableCell>Unit Of Measure</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rates.map(rate => (
            <TableRow key={uniqid()}>
              <TableCell>
                <GreaterThanIcon />
                {rate.endRange}
              </TableCell>
              <TableCell>{formatCurrency(rate.price)}</TableCell>
              <TableCell>{erc20ContractAddress}</TableCell>
              <TableCell>{rate.unitOfMeasure}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
};

RateTable.propTypes = {
  rates: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  erc20ContractAddress: PropTypes.string.isRequired,
};

RateTable.defaultProps = {
  rates: [],
  erc20ContractAddress: '',
};

export default RateTable;
