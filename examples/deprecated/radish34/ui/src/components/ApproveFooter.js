import React from 'react';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
  footer: {
    bottom: 0,
    maxWidth: '100%',
    height: '6rem',
    background: '#313131',
    color: '#fff',
    padding: '1rem',
  },
  button: {
    background: '#50A75D',
    color: '#fff',
    margin: '.5rem',
  },
  footerText: {
    marginLeft: '.5rem',
  }
}));

const ApproveFooter = ({ onClick, footerText, buttonText }) => {
  const classes = useStyles();

  return (
    <div className={classes.footer}>
      <Typography className={classes.footerText}>{footerText}</Typography>
      <Button className={classes.button} onClick={onClick}>{buttonText}</Button>
    </div>
  );
};

ApproveFooter.propTypes = {
  onClick: PropTypes.func.isRequired,
  footerText: PropTypes.string,
  buttonText: PropTypes.string,
};

ApproveFooter.defaultProps = {
  footerText: "By selecting 'I Approve', I am agreeing to the Terms & Conditions stated here and ...",
  buttonText: "I Approve",
};

export default ApproveFooter;
