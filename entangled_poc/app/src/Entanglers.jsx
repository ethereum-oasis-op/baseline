import React from 'react';
// import gql from 'graphql-tag';
// import { Query } from 'react-apollo';
import {
  Paper,
  Typography,
  Table,
  TableHead,
  TableBody,
  TableCell,
  TableRow
} from '@material-ui/core';

const Entanglers = props => {
  return (
    <Paper>
      <Typography>Entangled</Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Org Name</TableCell>
            <TableCell>Address</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {props.members.map(member => (
            <TableRow>
              <TableCell>{member.name}</TableCell>
              <TableCell>{member.address}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Paper>
  );
};

export default Entanglers;
