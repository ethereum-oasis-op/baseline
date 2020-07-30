const { v4 } = require("uuid");
const shortid = require("shortid");

shortid.characters(
  "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ$@"
);

export const IdHelper = {
  uuId: () => {
    return v4();
  },
  shortId: () => {
    return shortid.generate();
  },
};

export default IdHelper;
