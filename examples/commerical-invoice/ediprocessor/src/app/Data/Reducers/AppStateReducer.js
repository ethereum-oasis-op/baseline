import actiontypes from "../actiontypes";
import _ from "lodash";

const actions = {};

actions[actiontypes.AppState.SetValue] = (state, action) => {
  if (!action.payload.key) {
    throw new Error("Invalid key for app state!");
  }

  const newState = _.merge({}, state);

  let newkeystate = newState[action.payload.key];
  if (!newkeystate) {
    newkeystate = {};
    newState[action.payload.key] = newkeystate;
  }
  _.set(newkeystate, action.payload.prop, action.payload.value);
  return newState;
};

actions[actiontypes.AppState.AppendArrayValue] = (state, action) => {
  if (!action.payload.key) {
    throw new Error("Invalid key for app state!");
  }

  const newState = _.merge({}, state);

  let newkeystate = newState[action.payload.key];
  if (!newkeystate) {
    newkeystate = {};
    newState[action.payload.key] = newkeystate;
  }

  const currentValue = _.get(newkeystate, action.payload.prop);
  let newCurrentValue = [];

  if (_.isArray(currentValue) === true) {
    newCurrentValue = _.clone(currentValue);
  }

  if (_.isArray(action.payload.value)) {
    newCurrentValue = _.concat(newCurrentValue, action.payload.value);
  } else {
    newCurrentValue.push(action.payload.value);
  }

  _.set(newkeystate, action.payload.prop, newCurrentValue);

  return newState;
};

actions[actiontypes.AppState.UpdateArrayValue] = (state, action) => {
  if (!action.payload.key) {
    throw new Error("Invalid key for app state!");
  }

  const newState = _.merge({}, state);

  let newkeystate = newState[action.payload.key];
  if (!newkeystate) {
    newkeystate = {};
    newState[action.payload.key] = newkeystate;
  }

  const currentArrayValue = _.get(newkeystate, action.payload.prop);
  let newArrayValue = [];

  if (_.isArray(currentArrayValue) === false) {
    newArrayValue = _.clone(currentArrayValue);
  } else {
    _.set(newkeystate, action.payload.prop, newArrayValue);
  }

  let matches = _.filter(newArrayValue, action.payload.filterFunction);

  if (_.isFunction(action.payload.updateFunction)) {
    _.forEach(matches, (m) => {
      action.payload.updateFunction(m);
    });
    _.set(newkeystate, action.payload.prop, newArrayValue);
  } else if (_.isFunction(action.payload.modifyFunction)) {
    matches = action.payload.modifyFunction(matches);
    _.set(newkeystate, action.payload.prop, matches);
  }

  return newState;
};

actions[actiontypes.AppState.ClearArrayValue] = (state, action) => {
  if (!action.payload.key) {
    throw new Error("Invalid key for app state!");
  }

  const newState = _.merge({}, state);

  let newkeystate = newState[action.payload.key];
  if (!newkeystate) {
    newkeystate = {};
    newState[action.payload.key] = newkeystate;
  }

  _.set(newkeystate, action.payload.prop, []);

  return newState;
};

actions[actiontypes.AppState.ClearValue] = (state, action) => {
  if (!action.payload.key) {
    throw new Error("Invalid key for app state!");
  }

  const newState = _.merge({}, state);

  if (!action.payload.prop) {
    delete newState[action.payload.key];
  } else {
    const foundKey = newState[action.payload.key];
    if (foundKey) {
      delete foundKey[action.payload.prop];
    }
  }
  return newState;
};

export default (state = {}, action) => {
  if (_.startsWith(action.type, actiontypes.AppState.Prefix)) {
    return actions[action.type](state, action);
  } else {
    return state;
  }
};
