import types from "../statetypes";
export const DrawerList = (state) => {
  return state.Drawer.drawers || [];
};

export const StateList = [
  { name: types.Drawer.DrawerList, action: DrawerList, propName: "DrawerList" },
];
