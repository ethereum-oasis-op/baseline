import React from 'react';
import PropTypes from 'prop-types';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';

const SKUTable = ({ sku, description, volume }) => {
  return (
    <Table style={{ margin: '2rem 0 2rem 0' }}>
      <TableHead>
        <TableRow>
          <TableCell>SKU</TableCell>
          {description && <TableCell>Description</TableCell>}
          {volume && <TableCell>Volume</TableCell>}
        </TableRow>
      </TableHead>
      <TableBody>
        <TableRow>
          <TableCell>{sku}</TableCell>
          {description && <TableCell>{description}</TableCell>}
          {volume && <TableCell>{volume}</TableCell>}
        </TableRow>
      </TableBody>
    </Table>
  );
};

SKUTable.propTypes = {
  sku: PropTypes.string.isRequired,
  description: PropTypes.string,
  volume: PropTypes.number,
};

SKUTable.defaultProps = {
  description: undefined,
  volume: undefined,
};

export default SKUTable;
