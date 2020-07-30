import { X12SegmentHeaderLoopStyle } from "../node-x12/index";
export const H_ST = {
  tag: "ST",
  trailer: "SE",
  layout: {
    ST01: 3,
    ST02: 9,
    ST02_MIN: 4,
    ST03: 35,
    COUNT: 3,
    PADDING: false,
  },
  loopStyle: X12SegmentHeaderLoopStyle.Bounded,
  loopIdIndex: 1,
};
