import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(() => ({
  root: {
    // padding: '2rem',
    // border: '2px solid red',
  },
  inner: {},
}));

const FormWrapper = ({ children }) => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <div className={classes.inner}>{children}</div>
    </div>
  );
};

FormWrapper.propTypes = {
  children: PropTypes.node.isRequired,
};

export default FormWrapper;
