import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import RadishLogo from './RadishLogo';

const useStyles = makeStyles(() => ({
  image: {
    height: '3.5rem',
    width: '3.5rem',
    marginTop: '0.4rem',
  },
  logoContainer: {
    marginLeft: '1.5rem',
  },
}));

const ProfileSection = () => {
  const classes = useStyles();

  return (
    <Grid container direction="row">
      <Grid item>
        <img src="/images/DefaultProfile.jpg" className={classes.image} alt="default profile" />
      </Grid>
      <Grid item className={classes.logoContainer}>
        <RadishLogo width={20} height={40} />
      </Grid>
    </Grid>
  );
};

export default ProfileSection;
