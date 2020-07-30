import _ from "lodash";
import EDIRoutes from "./EDI/index";

const maps = [["/EDI", EDIRoutes]];

export const SetupServiceRoutes = (server) => {
  _.forEach(maps, (map) => {
    if (!map[0] | !map[1]) {
      throw Error(
        "route or service passed in is null, make sure you exported something!"
      );
    }
    server.use(`/Services${map[0]}`, map[1]);
  });
};
