import React, { Suspense } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';

import CssBaseline from '@material-ui/core/CssBaseline';
import Lato from 'typeface-lato'; // eslint-disable-line no-unused-vars
import { ThemeProvider } from '@material-ui/styles';
import theme from './theme';
import App from './App';
import AppProviders from './contexts';
import * as serviceWorker from './serviceWorker';

ReactDOM.render(
  <Router>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Suspense fallback={<div />}>
        <AppProviders>
          <App />
        </AppProviders>
      </Suspense>
    </ThemeProvider>
  </Router>,
  document.getElementById('root'),
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
