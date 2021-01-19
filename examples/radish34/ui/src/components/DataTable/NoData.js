import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(() => ({
  root: {
    width: '100%',
    height: '100%',
  },
}));

const NoMessages = () => {
  const classes = useStyles();

  return <div className={classes.root}>NoMessages</div>;
};

export default NoMessages;
