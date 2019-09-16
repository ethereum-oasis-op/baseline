import React, { Suspense } from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'connected-react-router';
import CssBaseline from '@material-ui/core/CssBaseline';
import { ThemeProvider } from '@material-ui/styles';
import { createMuiTheme } from '@material-ui/core/styles';
import store, { history } from './redux/store';
import App from './App';
import AppProviders from './contexts';
import * as serviceWorker from './serviceWorker';

const theme = {};

const initialStore = { user: {} };

ReactDOM.render(
  <Provider store={store(initialStore)}>
    <ConnectedRouter history={history}>
      <ThemeProvider theme={createMuiTheme(theme)}>
        <CssBaseline />
        <Suspense fallback={<div />}>
          <AppProviders>
            <App history={history} />
          </AppProviders>
        </Suspense>
      </ThemeProvider>
    </ConnectedRouter>
  </Provider>,
  document.getElementById('root'),
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
