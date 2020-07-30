import { combineReducers } from "redux";
import { reducer as formReducer } from "redux-form";

import AppState from "./Reducers/AppStateReducer";
import Drawer from "./Reducers/DrawerReducer";
import Router from "./Reducers/RouterReducer";

export const appReducers = () => {
  const reducers = {
    AppState: AppState,
    Drawer: Drawer,
    Router: Router,
    form: formReducer,
  };
  return combineReducers(reducers);
};
