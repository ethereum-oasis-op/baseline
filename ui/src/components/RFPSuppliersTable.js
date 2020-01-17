import React from 'react';
import Typography from '@material-ui/core/Typography';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import uniqid from 'uniqid';

const RFPSuppliersTable = ({ suppliers }) => {
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
          </TableRow>
        </TableHead>
        <TableBody>
          {suppliers.map(supplier => {
            return (
              <TableRow key={uniqid()}>
                <TableCell>{supplier.partner.name}</TableCell>
                <TableCell>
                  {supplier.receiptDate ? `Sent: ${supplier.receiptDate}` : 'Pending'}
                </TableCell>
                {/* TODO: integrate 2 table cells below */}
                <TableCell>N/A</TableCell>
                <TableCell>N/A</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </>
  );
};

export default RFPSuppliersTable;
