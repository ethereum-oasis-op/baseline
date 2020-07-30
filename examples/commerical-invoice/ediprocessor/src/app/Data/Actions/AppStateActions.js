import types from "../actiontypes";

export const SetValue = (key, prop, value) => {
  return {
    type: types.AppState.SetValue,
    payload: {
      key,
      prop,
      value,
    },
  };
};

export const SetValueDispatch = (dispatch) => {
  return (key, prop, value) => {
    dispatch(SetValue(key, prop, value));
  };
};

export const AppendArrayValue = (key, prop, value) => {
  return {
    type: types.AppState.AppendArrayValue,
    payload: {
      key,
      prop,
      value,
    },
  };
};

export const AppendArrayValueDispatch = (dispatch) => {
  return (key, prop, value) => {
    dispatch(AppendArrayValue(key, prop, value));
  };
};

export const UpdateArrayValue = (
  key,
  prop,
  filterFunction,
  updateFunction,
  modifyFunction
) => {
  return {
    type: types.AppState.UpdateArrayValue,
    payload: {
      key,
      prop,
      filterFunction,
      updateFunction,
      modifyFunction,
    },
  };
};

export const UpdateArrayValueDispatch = (dispatch) => {
  return (key, prop, filterFunction, updateFunction, modifyFunction) => {
    dispatch(
      UpdateArrayValue(
        key,
        prop,
        filterFunction,
        updateFunction,
        modifyFunction
      )
    );
  };
};

export const ClearArrayValue = (key, prop) => {
  return {
    type: types.AppState.ClearArrayValue,
    payload: {
      key,
      prop,
    },
  };
};

export const ClearArrayValueDispatch = (dispatch) => {
  return (key, prop) => {
    dispatch(ClearArrayValue(key, prop));
  };
};

export const ClearValue = (key, prop) => {
  return {
    type: types.AppState.ClearValue,
    payload: {
      key,
      prop,
    },
  };
};

export const ClearValueDispatch = (dispatch) => {
  return (key, prop) => {
    dispatch(ClearValue(key, prop));
  };
};

export const ActionList = [
  {
    name: types.AppState.ClearValue,
    action: ClearValueDispatch,
    propName: "AppStateClearValue",
  },
  {
    name: types.AppState.SetValue,
    action: SetValueDispatch,
    propName: "AppStateSetValue",
  },
  {
    name: types.AppState.AppendArrayValue,
    action: AppendArrayValueDispatch,
    propName: "AppStateAppendArray",
  },
  {
    name: types.AppState.UpdateArrayValue,
    action: UpdateArrayValueDispatch,
    propName: "AppStateUpdateArray",
  },
  {
    name: types.AppState.ClearArrayValue,
    action: ClearArrayValueDispatch,
    propName: "AppStateClearArray",
  },
];
