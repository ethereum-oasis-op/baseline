import { createStore, applyMiddleware, compose } from 'redux';
import { routerMiddleware } from 'connected-react-router';
import { createBrowserHistory } from 'history';
import { createLogger } from 'redux-logger';
import { apiMiddleware } from 'redux-api-middleware';
import thunk from 'redux-thunk';
import rootReducer from './rootReducer';
import errors from './errors';

export const history = createBrowserHistory();

// eslint-disable-next-line
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const middleware = [routerMiddleware(history), thunk, apiMiddleware, errors, createLogger()];

const store = preloadedState =>
  createStore(
    rootReducer(history),
    preloadedState,
    composeEnhancers(applyMiddleware(...middleware)),
  );

export default store;
