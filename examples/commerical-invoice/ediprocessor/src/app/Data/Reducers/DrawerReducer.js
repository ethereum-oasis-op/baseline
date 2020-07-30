import actiontypes from "../actiontypes";
import _ from "lodash";
import IdHelper from "common-tools/IdHelper";

const actions = {};

actions[actiontypes.Drawer.Show] = (state, action) => {
  const newState = _.merge({}, state);
  newState.drawers = _.concat(newState.drawers, {
    key: IdHelper.uuId(),
    component: action.payload.component,
    props: action.payload.props,
  });
  return newState;
};

actions[actiontypes.Drawer.Hide] = (state, action) => {
  const newState = _.merge({}, state);
  if (action.payload.key === "all") {
    newState.drawers = [];
  } else {
    newState.drawers = _.reject(newState.drawers, { key: action.payload.key });
  }
  return newState;
};

export default (
  state = {
    drawers: [],
  },
  action
) => {
  if (_.startsWith(action.type, actiontypes.Drawer.Prefix)) {
    return actions[action.type](state, action);
  } else {
    return state;
  }
};
