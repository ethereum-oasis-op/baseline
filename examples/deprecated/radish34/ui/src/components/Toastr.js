import React from 'react';
import PropTypes from 'prop-types';
import Snackbar from '@material-ui/core/Snackbar';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(() => ({
  success: {
    background: '#28D295',
  },
  error: {
    background: '#ff0a3f',
  },
}));

const Toastr = props => {
  const { open, variant, message, anchorOrigin, onClose } = props;
  const classes = useStyles();

  return (
    <Snackbar
      open={open}
      message={message}
      anchorOrigin={anchorOrigin}
      onClose={onClose}
      ContentProps={{
        classes: {
          root: classes[variant],
        },
      }}
    />
  );
};

Toastr.propTypes = {
  open: PropTypes.bool.isRequired,
  variant: PropTypes.oneOf(['success', 'error']).isRequired,
  message: PropTypes.string.isRequired,
  anchorOrigin: PropTypes.shape({}).isRequired,
  onClose: PropTypes.func.isRequired,
};

export default Toastr;
