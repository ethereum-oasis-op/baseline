import React, { useContext } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Chip from '@material-ui/core/Chip';
import Toolbar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import Typography from '@material-ui/core/Typography';
import { ServerSettingsContext } from '../../contexts/server-settings-context';
import Balance from '../../components/Balance';

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
  },
  appBar: {
    background: 'linear-gradient(0deg, rgba(37,49,57,1) 0%, rgba(73,87,98,1) 100%)',
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
  balance: {
    textAlign: 'right',
  },
  balanceLabel: {
    marginRight: '1rem',
  },
  balanceValue: {},
  orgAddress: {
    marginLeft: theme.spacing(2),
    background: '#DF315C',
    color: 'white',
  },
}));

const InstallationHeader = () => {
  const classes = useStyles();
  const { settings } = useContext(ServerSettingsContext);

  if (!settings) { return <div>No settings</div>}
  const { organizationAddress } = settings;

  return (
    <div className={classes.root}>
      <AppBar position="static" className={classes.appBar}>
        <Toolbar>
          <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" className={classes.title}>
            Radish34 Installation
            {
              organizationAddress
              ? <Chip className={classes.orgAddress} size="small" label={organizationAddress} />
              : null
            }
          </Typography>
          <Button color="inherit">Balance: <Balance /></Button>
        </Toolbar>
      </AppBar>
    </div>
  );
};

export default InstallationHeader;
