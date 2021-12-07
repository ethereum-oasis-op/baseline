import React from 'react';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import classNames from 'classnames';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
  root: {
    whiteSpace: 'nowrap',
    marginBottom: theme.spacing.unit * 2,
    display: 'flex',
    justifyContent: 'space-between',
    '& button:not(:first-child)': {
      marginLeft: '1rem',
    },
  },
  alignTop: {
    alignItems: 'flex-start',
  },
  alignBottom: {
    alignItems: 'flex-end',
  },
  alignRight: {
    justifyContent: 'flex-end',
  },
  marginTop: {
    marginTop: theme.spacing.unit * 5,
  },
  marginBottom: {
    marginBottom: theme.spacing.unit * 5,
  },
}));

const ButtonList = ({ children, align, marginTop, marginBottom }) => {
  const classes = useStyles();

  const className = classNames(classes.root, {
    [classes.alignTop]: align === 'top',
    [classes.alignBottom]: align === 'bottom',
    [classes.alignRight]: align === 'right',
    [classes.marginTop]: marginTop,
    [classes.marginBottom]: marginBottom,
  });

  return (
    <Grid item className={className}>
      {children}
    </Grid>
  );
};

ButtonList.propTypes = {
  align: PropTypes.oneOf(['top', 'bottom', 'right']),
  marginTop: PropTypes.bool,
  marginBottom: PropTypes.bool,
  children: PropTypes.oneOfType([PropTypes.string, PropTypes.array, PropTypes.node]).isRequired,
};

ButtonList.defaultProps = {
  align: 'top',
  marginTop: false,
  marginBottom: false,
};

export default ButtonList;
