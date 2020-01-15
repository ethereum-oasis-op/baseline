import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(() => ({
  root: {
    overflowX: 'scroll',
    maxHeight: '100%',
    width: '348px',
    background: '#f8fafb',
    borderRight: '1px solid #909ea9',
  },
}));

const Sidebar = ({ children }) => {
  const classes = useStyles();

  return <div className={classes.root}>{children}</div>;
};

Sidebar.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Sidebar;
