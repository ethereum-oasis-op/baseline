import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import PrimaryNavigation from './PrimaryNavigation';

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
      maxHeight: 'calc(100vh - 3rem)',
    },
    [theme.breakpoints.up('sm')]: {
      maxHeight: 'calc(100vh - 4rem)',
    },
  },
  scroll: {
    overflowX: 'scroll',
  },
}));

const Layout = ({ children }) => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <PrimaryNavigation />
      <div className={classes.content}>{children}</div>
    </div>
  );
};

Layout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Layout;
