import React, { useContext } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import { get } from 'lodash';
import { ServerStatusContext } from '../../contexts/server-status-context';

const useStyles = makeStyles(() => ({
  root: {
    position: 'absolute',
    top: '0',
    left: '0',
    background: 'black',
    color: 'white',
    padding: '.5rem 1rem',
  },
  paper: {},
  balance: {
    textAlign: 'right',
  },
  balanceLabel: {
    marginRight: '1rem',
  },
  balanceValue: {},
}));

const OnboardingStatus = () => {
  const classes = useStyles();
  const [status] = useContext(ServerStatusContext);
  const balance = get(status, 'serverStatusUpdate.balance', 342.03002);

  return (
    <Grid container className={classes.root}>
      <Grid item xs={8}>
        Radish34 Installation ( OrganizationAddress: 0xc1b8662A68F3eb66bC5e5C4DE7C1EF04Dc344d53 )
      </Grid>
      <Grid item xs={4}>
        <div className={classes.balance}>
          <span className={classes.balanceLabel}>Balance:</span>
          <span className={classes.balanceValue}>{balance}</span>
        </div>
      </Grid>
    </Grid>
  );
};

export default OnboardingStatus;
