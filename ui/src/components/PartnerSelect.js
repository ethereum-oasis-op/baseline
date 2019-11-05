import React from 'react';
import { PropTypes } from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';

const useStyles = makeStyles(theme => ({
  root: {},
}));

const PartnerSelect = ({ children }) => {
  const classes = useStyles();

  return <div>Partner Select</div>;
};

PartnerSelect.propTypes = {
  children: PropTypes.node.isRequired,
};

export default PartnerSelect;
