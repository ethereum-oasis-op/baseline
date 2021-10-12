import React from 'react';
import { PropTypes } from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';

const useStyles = makeStyles(() => ({
  root: {
    maxHeight: '100%',
    width: '100%',
    overflowX: 'scroll',
    background: 'white',
  },
}));

const PageWrapper = ({ children }) => {
  const classes = useStyles();

  return (
    <main className={classes.root}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          {children}
        </Grid>
      </Grid>
    </main>
  );
};

PageWrapper.propTypes = {
  children: PropTypes.node.isRequired,
};

export default PageWrapper;
