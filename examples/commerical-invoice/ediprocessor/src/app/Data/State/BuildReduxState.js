import _ from "lodash";
import { StateList as AppStateList } from "./AppStateState";
import { StateList as DrawerStateList } from "./DrawerState";
import { StateList as RouterStateList } from "./RouterState";

const AllStateList = _.concat(AppStateList, DrawerStateList, RouterStateList);

export const BuildReduxState = (states) => {
  return (state) => {
    const ret = {};
    _.forEach(states, (s) => {
      if (_.isPlainObject(s)) {
        const match = _.find(AllStateList, { name: s.name });

        if (match) {
          ret[match.propName || match.name] = match.action(...s.args)(state);
        } else {
          throw Error(`Unable to get state from function for ${s.name}`);
        }
      } else if (_.isString(s)) {
        const match = _.find(AllStateList, { name: s });
        if (match) {
          ret[match.propName || match.name] = match.action(state);
        } else {
          throw Error(`Unable to get state from string for ${s}`);
        }
      } else {
        throw Error(
          `Unable to get state, passed in name ${s} must be a function of string`
        );
      }
    });
    return ret;
  };
};

export default BuildReduxState;
