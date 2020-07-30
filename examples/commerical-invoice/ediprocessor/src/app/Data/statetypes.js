export default {
  Router: {
    Prefix: "ROUTER_",
    CurrentRoute: "ROUTER_CURRENTROUTE",
    PathNames: "ROUTER_PATHNAMES",
  },
  Drawer: {
    Prefix: "DRAWER_",
    DrawerList: "DRAWER_LIST",
  },
  AppState: {
    Prefix: "APPSTATE_",
    GetValues: function () {
      return {
        name: "APPSTATE_GETVALUES",
        args: arguments || [],
      };
    },
  },
};
