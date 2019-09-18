import React, { Component } from 'react';
import { Container, Typography, Paper, Grid } from '@material-ui/core';

import DataViewer from './DataViewer';
import Entanglers from './Entanglers';

// Custom config for each user type
import config from './config.js';

class App extends Component {
  render() {
    return (
      <Container maxWidth="sm">
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Paper>
              <Typography variant="h4" component="h1" gutterBottom>
                {config.name}
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12}>
            <DataViewer />
          </Grid>
          <Grid item xs={12}>
            <Entanglers members={config.entanglers} />
          </Grid>
        </Grid>
      </Container>
    );
  }
}

export default App;
