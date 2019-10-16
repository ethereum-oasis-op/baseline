import React, { Component } from 'react';
import { Container, Typography, Grid } from '@material-ui/core';

import DataViewer from './DataViewer';
import Entanglers from './Entanglers';
import Whispers from './Whispers';

// Custom config for each user type
import config from './config.js';

class App extends Component {
  render() {
    return (
      <Container maxWidth="sm">
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography variant="h4" component="h1" gutterBottom>
              {config.name}
            </Typography>
          </Grid>
          <Grid item xs={10}>
            <DataViewer />
          </Grid>
          <Grid item xs={8}>
            <Entanglers members={config.entanglers} />
          </Grid>
          <Grid item xs={12}>
            <Whispers />
          </Grid>
        </Grid>
      </Container>
    );
  }
}

export default App;
