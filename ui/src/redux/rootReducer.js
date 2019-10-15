import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';
import entities from './entities';

const rootReducer = history =>
  combineReducers({
    router: connectRouter(history),
    entities,
    user: (state = {}) => state,
  });

export default rootReducer;
