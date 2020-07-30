import { StandardSegmentHeaders } from "../node-x12/index";
import { H_EB } from "./H_EB";
import { H_ST } from "./H_ST";
import { H_NM1 } from "./H_NM1";
import _ from "lodash";

export const CustomSegmentHeaders = {
  H270: [..._.reject(StandardSegmentHeaders, { tag: "ST" }), H_ST, H_NM1, H_EB],
  H271: [..._.reject(StandardSegmentHeaders, { tag: "ST" }), H_ST, H_NM1, H_EB],
};
