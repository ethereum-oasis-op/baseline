import _ from "lodash";

export const GetValues = (key) => {
  return (state) => {
    if (_.isString(key)) {
      return _.get(state.AppState, key) || {};
    } else {
      throw Error("Key for Get App State values must be a string");
    }
  };
};

export const StateList = [
  { name: "APPSTATE_GETVALUES", action: GetValues, propName: "AppData" },
];
