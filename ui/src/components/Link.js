import React from 'react';
import PropTypes from 'prop-types';
import { Link as RouterLink } from 'react-router-dom';
import MUILink from '@material-ui/core/Link';

const Link = ({ to, children, color, underline }) => {
  return (
    <MUILink color="textPrimary" underline="none" component={RouterLink} to={to}>
      {children}
    </MUILink>
  );
};

Link.propTypes = {
  children: PropTypes.oneOfType([PropTypes.string, PropTypes.array, PropTypes.node]).isRequired,
  to: PropTypes.string.isRequired,
  color: PropTypes.oneOf([
    'default',
    'error',
    'inherit',
    'primary',
    'secondary',
    'textPrimary',
    'textSecondary',
  ]),
  underline: PropTypes.oneOf(['none', 'hover', 'always']),
};

Link.defaultProps = {
  color: 'textPrimary',
  underline: 'none',
};

export default Link;
