import React from 'react';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';

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

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    padding: theme.spacing(3, 2)
  }
}));

export const GET_WHISPERS = gql`
  query Whispers {
    whispers {
      _id
      sentAt
      deliverTo
      receivedAt
      message
    }
  }
`;

const Whispers = () => {
  const classes = useStyles();

  return (
    <Paper className={classes.root}>
      <Typography component="h5">Whisper Log</Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>To</TableCell>
            <TableCell>Sent At</TableCell>
            <TableCell>Received At</TableCell>
            <TableCell>Message</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <Query query={GET_WHISPERS}>
            {({ loading, data }) =>
              !loading &&
              data.whispers.map(whisper => (
                <TableRow key={whisper._id}>
                  <TableCell>{whisper._id}</TableCell>
                  <TableCell>{whisper.deliverTo}</TableCell>
                  <TableCell>{whisper.sentAt}</TableCell>
                  <TableCell>{whisper.receivedAt}</TableCell>
                  <TableCell>{whisper.message}</TableCell>
                </TableRow>
              ))
            }
          </Query>
        </TableBody>
      </Table>
    </Paper>
  );
};

export default Whispers;
