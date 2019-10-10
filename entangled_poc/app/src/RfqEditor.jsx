import React from 'react';
import gql from 'graphql-tag';
import client from './apollo';
import { Form, Field } from 'react-final-form';
import { TextField } from 'final-form-material-ui';
import { Paper, Typography, IconButton } from '@material-ui/core';
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

export const updateRfqMutation = gql`
  mutation UpdateRfq($_id: ID, $input: RfqInput) {
    updateRfq(_id: $_id, input: $input) {
      _id
    }
  }
`;

const RfqEditor = ({ rfq }) => {
  const classes = useStyles();

  return (
    <Form
      onSubmit={async ({ _id, itemQty }) => {
        const input = { itemQty: parseInt(itemQty) };
        await client.mutate({
          variables: { _id, input },
          mutation: updateRfqMutation
        });
      }}
      initialValues={rfq}
      render={({ handleSubmit, pristine, invalid }) => (
        <form onSubmit={handleSubmit} noValidate>
          <Paper className={classes.root}>
            <Typography variant="h5" component="h3">
              RFQ #{rfq.refNum}
            </Typography>
            <Typography component="p">
              {' '}
              This is an example RFQ document with one entangled field{' '}
            </Typography>
            <Field
              name="itemQty"
              component={TextField}
              type="text"
              label="Item Qty"
            />
            <IconButton type="submit" disabled={pristine}>
              <SettingsEthernet />
            </IconButton>
          </Paper>
        </form>
      )}
    />
  );
};

export default RfqEditor;
