import express from "express";
import _ from "lodash";

export const ControllerRouteIndex = (...maplist) => {
  const router = express.Router();

  let maps = [];

  _.forEach(maplist, (map) => {
    //eslint-disable-line
    if (_.isArray(map)) {
      maps = _.concat(maps, map);
    }
  });

  if (maps.length === 0) {
    throw Error("maps is empty, can not build route index!");
  }

  _.forEach(maps, (map) => {
    if (!map[0] | !map[1]) {
      throw Error(
        "map or controller passed in is null, check your passed in parameters something!"
      );
    }
    router.post(map[0], map[1]);
  });

  return router;
};
