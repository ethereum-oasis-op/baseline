var ESAPI = require("node-esapi").encoder();

/**
 * Encode the `value` parameter such that it is safe to be embedded into an HTML page.
 *
 * @param  {String}     value   The input string for which the HTML characters need to be escaped. If unspecified, the empty string will be returned
 * @return {String}             The input string after the HTML characters have been escaped
 */
export const encodeForHTML = function (value) {
  if (!value) {
    return "";
  }

  return ESAPI.encodeForHTML(value);
};
