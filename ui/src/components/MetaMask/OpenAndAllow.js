import React, { useContext } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import { withTheme } from '@material-ui/styles';
import { Typography } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import Link from '@material-ui/core/Link';
import List from '@material-ui/core/List';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord';
import ListItemText from '@material-ui/core/ListItemText';
import MetaMaskContext from '../../contexts/metamask-context';

const useStyles = makeStyles(theme => ({
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
  link: {
    color: `${theme.palette.primary.blue}`,
  },
  image: {
    backgroundColor: 'blue',
    margin: '2rem',
  },
}));

const text =
  'Need intriguing and succinct copy explaining the benefits of Radish34. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor.';

const OpenAndAllow = ({ theme }) => {
  const { openMetaMask } = useContext(MetaMaskContext);
  const classes = useStyles();

  const bulletList = listText => (
    <div style={{ display: 'flex' }}>
      <ListItemIcon>
        <FiberManualRecordIcon />
      </ListItemIcon>
      <ListItemText>{listText}</ListItemText>
    </div>
  );

  return (
    <>
      <Typography variant="h4">Welcome to Radish34</Typography>
      <Typography variant="body">{text}</Typography>
      <List>
        {bulletList('Lorem ipsum dolor sit amet, consectetur adipiscing.')}
        {bulletList('Lorem ipsum dolor sit amet, consectetur adipiscing.')}
        {bulletList('Lorem ipsum dolor sit amet, consectetur adipiscing.')}
      </List>
      <Typography variant="body">Connect to a secure wallet to access Radish34.</Typography>
      <div />
      <Button type="button" onClick={openMetaMask} className={classes.metamaskButton}>
        <img alt="Logo" src={theme.metamaskLogo} className={classes.metamaskLogo} />
        Connect with MetaMask
      </Button>
      <div />
      <Link href="https://metamask.io" className={classes.link}>
        How to set up a MetaMask account
      </Link>
    </>
  );
};

OpenAndAllow.propTypes = {
  theme: PropTypes.shape({
    metamaskLogo: PropTypes.instanceOf(Element).isRequired,
  }).isRequired,
};

export default withTheme(OpenAndAllow);
