import types from "../actiontypes";

export const SetNewLocation = (pathname, search, hash) => {
  return {
    type: types.Router.SetNewLocation,
    payload: {
      pathname,
      search,
      hash,
    },
  };
};

export const SetNewLocationDispatch = (dispatch) => {
  return (pathname, search, hash) => {
    dispatch(SetNewLocation(pathname, search, hash));
  };
};

export const AddPathName = (key, value, disabled) => {
  return {
    type: types.Router.AddPathName,
    payload: {
      key,
      value,
      disabled: disabled === true,
    },
  };
};

export const AddPathNameDispatch = (dispatch) => {
  return (key, value, disabled) => {
    dispatch(AddPathName(key, value, disabled));
  };
};

export const ClearPathNames = () => {
  return {
    type: types.Router.ClearPathNames,
  };
};

export const ClearLayoutContentBreadCrumbKeysDispatch = (dispatch) => {
  return () => {
    dispatch(ClearPathNames());
  };
};

export const ActionList = [
  {
    name: types.Router.SetNewLocation,
    action: SetNewLocationDispatch,
    propName: "RouterSetNewLocation",
  },
  {
    name: types.Router.AddPathName,
    action: AddPathNameDispatch,
    propName: "RouterAddPathName",
  },
  {
    name: types.Router.ClearPathNames,
    action: ClearPathNames,
    propName: "RouterClearPathNames",
  },
];
