import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import { withTheme } from '@material-ui/styles';
import MetaMaskContext from '../../contexts/metamask-context';

const useStyles = makeStyles(() => ({
  root: {
    border: '1px soild red',
  },
  metamaskButton: {
    marginTop: '.8rem',
    marginBottom: '.8rem',
    border: '1px solid #CCCCCC',
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
    backgroundColor: '#FFFFFF',
    paddingRight: '.8rem',
  },
  metamaskLogo: {
    width: '1.3rem',
    margin: '.5rem',
  },
}));

const SetupMetamaskForm = ({ theme }) => {
  const { openMetaMask } = useContext(MetaMaskContext);
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Grid container spacing={3}>
        <Grid item xs={6}>
          <div>Metamask not detected yet</div>
          <div>Metamask is not connected to the same network you provided.</div>
        </Grid>
        <Grid item xs={6}>
          <Button type="button" onClick={openMetaMask} className={classes.metamaskButton}>
            <img alt="Logo" src={theme.metamaskLogo} className={classes.metamaskLogo} />
            Connect with MetaMask
          </Button>
        </Grid>
      </Grid>
    </div>
  );
};

SetupMetamaskForm.propTypes = {
  theme: PropTypes.objectOf({
    metamaskLogo: PropTypes.string.isRequired,
  }).isRequired,
};

export default withTheme(SetupMetamaskForm);
