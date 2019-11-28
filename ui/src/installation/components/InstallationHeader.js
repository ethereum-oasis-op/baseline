import React, { useContext } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Chip from '@material-ui/core/Chip';
import Toolbar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import Typography from '@material-ui/core/Typography';
import { get } from 'lodash';
import { ServerStatusContext } from '../../contexts/server-status-context';

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
  const [status] = useContext(ServerStatusContext);
  const balance = get(status, 'serverStatusUpdate.balance', 342.03002);

  const orgAddress = '0x123';

  return (
    <div className={classes.root}>
      <AppBar position="static" className={classes.appBar}>
        <Toolbar>
          <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" className={classes.title}>
            Organization Address
            <Chip className={classes.orgAddress} size="small" label={orgAddress} />
          </Typography>
          <Button color="inherit">Balance: {balance} </Button>
        </Toolbar>
      </AppBar>
    </div>
  );

  // return (
  //   <Grid container className={classes.root}>
  //     <Grid item xs={8}>
  //       Radish34 Installation ( OrganizationAddress: 0xc1b8662A68F3eb66bC5e5C4DE7C1EF04Dc344d53 )
  //     </Grid>
  //     <Grid item xs={4}>
  //       <div className={classes.balance}>
  //         <span className={classes.balanceLabel}>Balance:</span>
  //         <span className={classes.balanceValue}>{balance}</span>
  //       </div>
  //     </Grid>
  //   </Grid>
  // );
};

export default InstallationHeader;
