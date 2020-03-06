import React from 'react';
import PropTypes from 'prop-types';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';

const SKUTable = ({ rfp }) => {
  return (
    <Table style={{ margin: '2rem 0 2rem 0' }}>
      <TableHead>
        <TableRow>
          <TableCell>SKU</TableCell>
          <TableCell>Description</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        <TableRow>
          <TableCell>{rfp.sku}</TableCell>
          <TableCell>{rfp.skuDescription}</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
};

SKUTable.propTypes = {
  rfp: PropTypes.shape({}).isRequired,
};

export default SKUTable;
