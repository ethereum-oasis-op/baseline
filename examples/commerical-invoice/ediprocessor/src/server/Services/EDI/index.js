import { ControllerRouteIndex } from "common-core/ControllerRouteIndex";

import EDIParse from "./Parse/index";
import EDIGenerate from "./Generate/index";

export default ControllerRouteIndex(EDIParse, EDIGenerate, []);
