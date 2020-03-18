import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import InstallationHeader from './InstallationHeader';

const useStyles = makeStyles(theme => ({
  root: {
    marginTop: '3.5rem',
    '@media (min-width: 0px) and (orientation: landscape)': {
      marginTop: '3rem',
    },
    [theme.breakpoints.up('sm')]: {
      marginTop: '4rem',
    },
  },
  content: {
    display: 'flex',
    maxHeight: 'calc(100vh - 3.5rem)',
    '@media (min-width: 0px) and (orientation: landscape)': {
      minHeight: 'calc(100vh - 3rem)',
    },
    [theme.breakpoints.up('sm')]: {
      minHeight: 'calc(100vh - 4rem)',
    },
  },
}));

const InstallationLayout = ({ children }) => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <InstallationHeader />
      <div className={classes.content}>{children}</div>
    </div>
  );
};

InstallationLayout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default InstallationLayout;
