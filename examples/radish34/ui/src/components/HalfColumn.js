import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import classNames from 'classnames';

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: 'calc(100vh - 4rem)',
    width: '50%',
    maxHeight: 'calc(100vh - 3.5rem)',
    '@media (min-width: 0px) and (orientation: landscape)': {
      maxHeight: 'calc(100vh - 3rem)',
    },
    [theme.breakpoints.up('sm')]: {
      maxHeight: 'calc(100vh - 4rem)',
    },
  },
  leftColumn: {
    background: '#F4F6F8',
    borderRight: '1px solid #5f747f',
  },
  rightColumn: {
    background: '#FFFFFF',
  },
}));

const HalfColumn = ({ children, rightColumn }) => {
  const classes = useStyles();
  const className = classNames({
    [classes.root]: true,
    [classes.rightColumn]: rightColumn,
    [classes.leftColumn]: !rightColumn,
  });

  return <div className={className}>{children}</div>;
};

HalfColumn.propTypes = {
  children: PropTypes.node.isRequired,
  rightColumn: PropTypes.bool.isRequired,
};

export default HalfColumn;
