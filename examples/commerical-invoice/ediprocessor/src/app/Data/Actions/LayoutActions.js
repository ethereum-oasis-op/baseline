import types from "../actiontypes";

export const SetSideBarItems = (value) => {
  return {
    type: types.AppState.SetValue,
    payload: {
      key: "Controls_Layout_ComponentData",
      prop: "sideBarItems",
      value,
    },
  };
};

export const SetSideBarItemsDispatch = (dispatch) => {
  return (value) => {
    dispatch(SetSideBarItems(value));
  };
};

export const ClearSideBarItems = (key, prop) => {
  return {
    type: types.AppState.ClearValue,
    payload: {
      key: "Controls_Layout_ComponentData",
      prop: "sideBarItems",
    },
  };
};

export const ClearSideBarItemsDispatch = (dispatch) => {
  return () => {
    dispatch(ClearSideBarItems());
  };
};

export const ActionList = [
  {
    name: types.Layout.SetSideBarItems,
    action: SetSideBarItemsDispatch,
    propName: "LayoutSetSideBarItems",
  },
  {
    name: types.Layout.ClearSideBarItems,
    action: ClearSideBarItemsDispatch,
    propName: "LayoutClearSideBarItems",
  },
];
