import types from "../statetypes";
export const CurrentRoute = (state) => {
  return {
    pathname: state.Router.currentRoute.pathname,
    search: state.Router.currentRoute.search,
    hash: state.Router.currentRoute.hash,
  };
};

export const PathNames = (state) => {
  return state.Router.pathNames || [];
};

export const StateList = [
  {
    name: types.Router.CurrentRoute,
    action: CurrentRoute,
    propName: "RouterCurrentRoute",
  },
  {
    name: types.Router.PathNames,
    action: PathNames,
    propName: "RouterPathNames",
  },
];
