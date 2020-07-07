'use strict';
const fs = require('fs');
const { WASI } = require('wasi');
const wasi = new WASI({
  args: process.argv,
  env: process.env,
  preopens: {
    '/sandbox': '/Users/Kartheek.Solipuram@ey.com/chainprojects/zkprojects/baseline/baseline/core/privacy/test'
  }
});
const importObject = { wasi_snapshot_preview1: wasi.wasiImport };

(async () => {
  const wasm = await WebAssembly.compile(fs.readFileSync('./index_bg.wasm'));
  const instance = await WebAssembly.instantiate(wasm, importObject);
  console.log('WASM Testing');
  wasi.start(instance);
  console.log('WASM Testing Ends');
})();