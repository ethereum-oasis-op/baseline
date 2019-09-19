import React from 'react';
import clsx from 'clsx';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import {
  Paper,
  Typography,
  Box,
  FormControl,
  InputLabel,
  Input,
  InputAdornment,
  IconButton
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

export const GET_RFQS = gql`
  query GetRFQs {
    rfqs {
      id
      itemQty
    }
  }
`;

const DataViewer = () => {
  const classes = useStyles();

  return (
    <Query query={GET_RFQS}>
      {({ loading, data }) =>
        !loading && (
          <Box>
            {data.rfqs.map(rfq => (
              <Paper className={classes.root}>
                <Typography variant="h5" component="h3">
                  RFQ #123
                </Typography>
                <Typography component="p">
                  {' '}
                  This is an example RFQ document with one entangled field{' '}
                </Typography>
                <FormControl
                  className={clsx(classes.margin, classes.textField)}
                >
                  <InputLabel htmlFor="rfq-input-qty">Item Quantity</InputLabel>
                  <Input
                    id="rfq-input-qty"
                    value={rfq.itemQty}
                    type="text"
                    margin="normal"
                    className={classes.textField}
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton>
                          <SettingsEthernet />
                        </IconButton>
                      </InputAdornment>
                    }
                  />
                </FormControl>
              </Paper>
            ))}
          </Box>
        )
      }
    </Query>
  );
};

export default DataViewer;
