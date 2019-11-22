import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(() => ({
  root: {
    textAlign: 'right',
    marginTop: '1rem',
  },
}));

const FormButtonWrapper = ({ children }) => {
  const classes = useStyles();

  return (
    <div className={classes.root}>{ children }</div>
  );
};

export default FormButtonWrapper;
