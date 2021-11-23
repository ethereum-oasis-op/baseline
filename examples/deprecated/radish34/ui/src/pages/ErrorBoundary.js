import React from 'react';
import PropTypes from 'prop-types';
import withStyles from '@material-ui/core/styles/withStyles';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
    this.handleError = this.handleError.bind(this);
  }

  componentDidCatch() {
    // Catch errors in any components below and re-render with error message
    this.setState({
      hasError: true,
    });
  }

  handleError() {
    this.setState({ hasError: false });
  }

  render() {
    const { hasError } = this.state;
    const { children, classes } = this.props;

    if (hasError) {
      return (
        <Grid container>
          <Grid container justify="center" spacing={16}>
            <Typography variant="h2" component="h2" className={classes.text}>
              Something went wrong.
            </Typography>
          </Grid>
        </Grid>
      );
    }

    return children;
  }
}

ErrorBoundary.propTypes = {
  children: PropTypes.node.isRequired,
  classes: PropTypes.shape({
    text: PropTypes.string.isRequired,
  }).isRequired,
};

const styles = () => ({
  text: {
    marginTop: '8rem',
    marginBottom: '8rem',
  },
});

export default withStyles(styles)(ErrorBoundary);
