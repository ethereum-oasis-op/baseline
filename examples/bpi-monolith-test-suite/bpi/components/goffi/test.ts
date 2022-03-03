
var ffi = require("ffi-napi");
import path from 'path';

console.log(path.join(__dirname,'goffi.dll'));

// define foreign functions
var goffi = ffi.Library(path.join(__dirname,'goffi.dll'),
 {'runcircuit': ['string', ['string', 'string']]
});

// call Add
console.log(goffi.runcircuit("1", "1"));
