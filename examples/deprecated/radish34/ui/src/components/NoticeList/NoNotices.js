import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import WelcomeImage from '../../images/welcome-to-radish.png';

const useStyles = makeStyles(() => ({
  root: {
    color: 'black',
    margin: '3rem',
    textAlign: 'center',
  },
  welcome: {
    color: 'black',
  },
  intro: {
    color: 'black',
    marginBottom: '1rem',
  },
  calltoAction: {
    color: 'black',
    marginBottom: '1rem',
  },
  buttonWrapper: {
    margin: '2rem',
  },
  button: {
  },
  welcomeImage: {
  },
}));

const NoNotices = () => {
  const classes = useStyles();

  return (
  <div className={classes.root}>
    <Typography variant="h4" className={classes.welcome}>Welcome to Radish</Typography>
    <Typography variant="h3" className={classes.intro}>Some text here to get users motivated to start using the application.</Typography>
    <Typography variant="h5" className={classes.calltoAction}>Let's get started by connecting to partners</Typography>
    <div className={classes.buttonWrapper}>
      <Button variant="contained" color="primary" className={classes.button}>View Registry</Button>
    </div>
    <img className={classes.welcomeImage} src={WelcomeImage} alt="Welcome to Radish" />
  </div>
  );
};

export default NoNotices;
