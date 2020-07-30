import types from "../actiontypes";

export const CloseDrawer = (key) => {
  return {
    type: types.Drawer.Hide,
    payload: {
      key,
    },
  };
};

export const CloseDrawerDispatch = (dispatch) => {
  return (key) => {
    dispatch(CloseDrawer(key));
  };
};

export const OpenDrawer = (component, props) => {
  return {
    type: types.Drawer.Show,
    payload: {
      component,
      props,
    },
  };
};

export const OpenDrawerDispatch = (dispatch) => {
  return (component, props) => {
    dispatch(OpenDrawer(component, props));
  };
};

export const ActionList = [
  {
    name: types.Drawer.Show,
    action: OpenDrawerDispatch,
    propName: "DrawerShow",
  },
  {
    name: types.Drawer.Hide,
    action: CloseDrawerDispatch,
    propName: "DrawerHide",
  },
];
