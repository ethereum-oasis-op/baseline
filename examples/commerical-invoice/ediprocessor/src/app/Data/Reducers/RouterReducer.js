import actiontypes from "../actiontypes";
import _ from "lodash";
import queryString from "query-string";

const actions = {};

actions[actiontypes.Router.SetNewLocation] = (state, action) => {
  const newState = _.merge({}, state);

  newState.currentRoute = _.merge(
    {
      pathname: undefined,
      search: undefined,
      hash: undefined,
      query: {},
    },
    action.payload
  );

  if (newState.currentRoute.search) {
    newState.currentRoute.query = queryString.parse(
      newState.currentRoute.search
    );
  }
  return newState;
};

actions[actiontypes.Router.AddPathName] = (state, action) => {
  const newState = _.merge({}, state);

  const match = _.find(newState.pathNames, { key: action.payload.key });

  if (match) {
    match.value = action.payload.value;
  } else {
    newState.pathNames.push(action.payload);
  }

  return newState;
};

actions[actiontypes.Router.ClearPathNames] = (state, action) => {
  const newState = _.merge({}, state);

  newState.pathNames = [];
  return newState;
};

export default (
  state = {
    currentRoute: {},
    pathNames: [],
  },
  action
) => {
  if (_.startsWith(action.type, actiontypes.Router.Prefix)) {
    return actions[action.type](state, action);
  } else {
    return state;
  }
};
