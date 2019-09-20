
function hasJsonStructure(str) {
  if (typeof str !== 'string') return false;
  try {
    const result = JSON.parse(str);
    const type = Object.prototype.toString.call(result);
    return type === '[object Object]'
      || type === '[object Array]';
  } catch (err) {
    return false;
  }
};

// ***** Usage *****
// const [err, result] = safeJsonParse('[Invalid JSON}');
// if (err) console.log('Failed to parse JSON: ' + err.message);
// else console.log(result);
function safeJsonParse(str) {
  try {
    return [null, JSON.parse(str)];
  } catch (err) {
    return [err];
  }
};

module.exports = {
  hasJsonStructure,
  safeJsonParse
};