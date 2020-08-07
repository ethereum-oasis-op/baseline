/*
 *
 *  * Copyright (c) 2020 FreightTrust and Clearing Corporation
 *  *
 *  * This Source Code Form is subject to the terms of the Mozilla Public
 *  * License, v. 2.0. If a copy of the MPL was not distributed with this
 *  * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

var rpc = require('node-json-rpc');

var options = {
  port: 8000,
  host: '127.0.0.1',
  path: '/',
  strict: false
};

var client = new rpc.Client(options);

client.call(
  {"jsonrpc": "2.0", "method": "receivedMessageCount", "params": [], "id": 0},
  function (err, res) {
    // Did it all work ? 
    if (err) { console.log(err); }
    else { console.log(res); }
  }
);

// @dev TODO : Replace with LIBRARY
client.call(
  {"jsonrpc": "2.0", "method": "getMessageByNumber", "params": [10], "id": 0},
  function (err, res) {
    if (err) { console.log(err); }
    else { console.log(res); }
  }
);

client.call(
  {"jsonrpc": "2.0", "method": "decryptMessageByNumber", "params": [10], "id": 0},
  function (err, res) {
    if (err) { console.log(err); }
    else { console.log(res); }
  }
);

