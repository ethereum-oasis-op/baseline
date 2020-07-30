import { createStore, compose } from "redux";
import { appReducers } from "common-data/reduxhelper";

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export const store = createStore(appReducers(), composeEnhancers());

export default store;
