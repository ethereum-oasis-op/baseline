import React from 'react';
import PropTypes from 'prop-types';
import { Link as RouterLink } from 'react-router-dom';
import MUILink from '@material-ui/core/Link';

const Link = ({ to, children, underline }) => {
  return (
    <MUILink color="textPrimary" underline={underline} component={RouterLink} to={to}>
      {children}
    </MUILink>
  );
};

Link.propTypes = {
  children: PropTypes.oneOfType([PropTypes.string, PropTypes.array, PropTypes.node]).isRequired,
  to: PropTypes.string.isRequired,
  underline: PropTypes.string,
};

Link.defaultProps = {
  underline: "none"
};

export default Link;
