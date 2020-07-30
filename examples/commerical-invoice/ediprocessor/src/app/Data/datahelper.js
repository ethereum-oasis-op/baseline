import React from "react";
import { connect } from "react-redux";
import BuildReduxActions from "./Actions/BuildReduxActions";
import BuildReduxState from "./State/BuildReduxState";
export { compose } from "redux";
export { default as ah } from "./actiontypes";
export { default as sh } from "./statetypes";

export const WithProps = (injectedProps) => (WrappedComponent) => {
  const HasProps = (props) => (
    <WrappedComponent {...injectedProps} {...props} />
  );
  return HasProps;
};

export const WithRedux = (states = [], actions = []) => {
  return connect(BuildReduxState(states), BuildReduxActions(actions));
};
