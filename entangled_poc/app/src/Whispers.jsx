import React from 'react';
import gql from 'graphql-tag';
import { Query, Subscription } from 'react-apollo';

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

const LISTEN_WHISPERS = gql`
  subscription WhisperAdded {
    whisperAdded {
      _id
      deliverTo
      sentAt
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
            <TableCell>To</TableCell>
            <TableCell>Sent At</TableCell>
            <TableCell>Message</TableCell>
            <TableCell>Received At</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <Query query={GET_WHISPERS}>
            {({ loading, data }) =>
              !loading &&
              data.whispers.map(whisper => (
                <TableRow key={whisper._id}>
                  <TableCell>{whisper.deliverTo}</TableCell>
                  <TableCell>{whisper.sentAt}</TableCell>
                  <TableCell>{whisper.message}</TableCell>
                  <TableCell>{whisper.receivedAt}</TableCell>
                </TableRow>
              ))
            }
          </Query>
          <Subscription subscription={LISTEN_WHISPERS}>
            {({ data, loading }) => {
              if (!loading && data) {
                const { whisperAdded } = data;
                return (
                  <TableRow key={whisperAdded._id}>
                    <TableCell>{whisperAdded.deliverTo}</TableCell>
                    <TableCell>{whisperAdded.sentAt}</TableCell>
                    <TableCell>{whisperAdded.message}</TableCell>
                    <TableCell>{whisperAdded.receivedAt}</TableCell>
                  </TableRow>
                );
              }
              return null;
            }}
          </Subscription>
        </TableBody>
      </Table>
    </Paper>
  );
};

export default Whispers;
