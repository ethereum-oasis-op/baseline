import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import { Link } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import ListSubheader from '@material-ui/core/ListSubheader';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';

const useStyles = makeStyles(theme => ({
  root: {
    background: '#f8fafb',
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
    paddingLeft: theme.spacing(2),
    width: '100%',
  },
  button: {
    textTransform: 'capitalize',
    paddingLeft: theme.spacing(1),
  },
  icon: {
    marginRight: theme.spacing(1),
  },
}));

const SidebarButton = ({ to, label }) => {
  const classes = useStyles();

  return (
    <ListSubheader className={classes.root}>
      <Button
        className={classes.button}
        component={Link}
        variant="outlined"
        color="primary"
        to={to}
      >
        <AddCircleOutlineIcon className={classes.icon} />
        {label}
      </Button>
    </ListSubheader>
  );
};

SidebarButton.propTypes = {
  to: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
};

export default SidebarButton;
