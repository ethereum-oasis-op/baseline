import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(() => ({
  root: {
    textAlign: 'right',
    marginTop: '1rem',
  },
}));

const FormButtonWrapper = ({ children }) => {
  const classes = useStyles();

  return <div className={classes.root}>{children}</div>;
};

FormButtonWrapper.propTypes = {
  children: PropTypes.node.isRequired,
};

export default FormButtonWrapper;
