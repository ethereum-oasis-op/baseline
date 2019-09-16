import React, { useContext } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import { UserContext } from '../../contexts/user-context';

const useStyles = makeStyles(() => ({
  title: {
    fontSize: 14,
  },
  pos: {
    marginBottom: 12,
  },
}));

const LoggedIn = () => {
  const classes = useStyles();
  const { user } = useContext(UserContext);

  if (!user) {
    return null;
  }

  return (
    <>
      <Typography className={classes.title} color="textSecondary" gutterBottom>
        Role: {user.role}
      </Typography>
      <Typography variant="h5" component="h2">
        {user.name}
      </Typography>
      <Typography className={classes.pos} color="textSecondary">
        {user.address}
      </Typography>
      <Typography variant="body2" component="p">
        You are logged in
      </Typography>
    </>
  );
};

export default LoggedIn;
