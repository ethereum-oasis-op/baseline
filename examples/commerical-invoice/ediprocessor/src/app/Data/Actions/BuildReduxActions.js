import _ from "lodash";
import { ActionList as AppStateActionList } from "./AppStateActions";
import { ActionList as DrawerActionList } from "./DrawerActions";
import { ActionList as RouterActionList } from "./RouterActions";
import { ActionList as LayoutActionList } from "./LayoutActions";

const AllActionsList = _.concat(
  AppStateActionList,
  DrawerActionList,
  RouterActionList,
  LayoutActionList
);

export const BuildReduxActions = (actions) => {
  return (dispatch) => {
    const ret = {};
    _.forEach(actions, (a) => {
      try {
        const match = _.find(AllActionsList, { name: a });
        if (match) {
          ret[match.propName || match.name] = match.action(dispatch);
        } else {
        }
      } catch (err) {
        throw Error(`Error setting dispatch function for action '${a}'`);
      }
    });
    return ret;
  };
};

export default BuildReduxActions;
