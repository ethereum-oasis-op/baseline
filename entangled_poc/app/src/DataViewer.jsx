import React from 'react';
// import gql from 'graphql-tag';
// import { Query } from 'react-apollo';
import { Paper, Typography, Box, Fab, TextField } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import AddIcon from '@material-ui/icons/Add';
import RemoveIcon from '@material-ui/icons/Remove';

const useStyles = makeStyles(theme => ({
  fab: {
    margin: theme.spacing(1)
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: 200
  }
}));

const DataViewer = () => {
  const classes = useStyles();

  return (
    <Paper>
      <Typography>RFQ #123</Typography>
      <Box>
        <TextField
          label="Item Quantity"
          value="11"
          margin="normal"
          className={classes.textField}
        />
        <Fab size="small" color="primary" className={classes.fab}>
          <AddIcon />
        </Fab>
        <Fab size="small" color="secondary" className={classes.fab}>
          <RemoveIcon />
        </Fab>
      </Box>
    </Paper>
  );
};

export default DataViewer;
