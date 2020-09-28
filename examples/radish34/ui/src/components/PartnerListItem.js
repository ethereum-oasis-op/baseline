import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import { NavLink } from 'react-router-dom';

const useStyles = makeStyles(() => ({
  root: {
    textDecoration: 'none',
  },

  item: {
    display: 'flex',
    flexDirection: 'column',
    padding: '1rem',
  },
  selected: {
    display: 'block',
    background: '#dfe4e8',
  },
}));

const PartnerListItem = ({ name, address, role }) => {
  const classes = useStyles();
  return (
    <NavLink
      exact
      to={`/partners/${name}`}
      className={classes.root}
      activeClassName={classes.selected}
    >
      <span className={classes.item}>
        <Typography color="textPrimary">
          <Typography variant="caption" gutterBottom>
            Role - {role}
          </Typography>
          <br />
          <Typography variant="body" gutterBottom>
            {name}
          </Typography>
          <br />
          <Typography variant="caption" className={classes.address} gutterBottom>
            {address}
          </Typography>
        </Typography>
      </span>
      <Divider />
    </NavLink>
  );
};

PartnerListItem.propTypes = {
  name: PropTypes.string.isRequired,
  address: PropTypes.string.isRequired,
  role: PropTypes.string.isRequired,
};

export default PartnerListItem;
