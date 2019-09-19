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
import { makeStyles } from '@material-ui/core/styles';
import SettingsEthernet from '@material-ui/icons/SettingsEthernet';

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    padding: theme.spacing(3, 2)
  },
  margin: {
    marginLeft: theme.spacing(0),
    marginRight: theme.spacing(1)
  },
  textField: {
    width: 200
  }
}));

const Entanglers = props => {
  const classes = useStyles();

  return (
    <Paper className={classes.root}>
      <Typography component="h5">Entangled</Typography>
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
