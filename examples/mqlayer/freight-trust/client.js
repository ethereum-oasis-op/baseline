var rpc = require('node-json-rpc');

var options = {  
  port: 8545,  
  host: '18.216.213.235:8545',  
  path: '/',  
  strict: false
};
 
var client = new rpc.Client(options);


client.call(
  {"jsonrpc": "2.0", "method": "web3_clientVersion", "params": [], "id": 0},
  function (err, res) {
    // Did it all work ? 
    if (err) { console.log(err); }
    else { console.log(res); }
  }
);

client.call(
  {"jsonrpc": "2.0", "method": "receivedMessageCount", "params": [], "id": 0},
  function (err, res) {
    // Did it all work ? 
    if (err) { console.log(err); }
    else { console.log(res); }
  }
);

client.call(
  {"jsonrpc": "2.0", "method": "getMessageByNumber", "params": [10], "id": 0},
  function (err, res) {
    // Did it all work ? 
    if (err) { console.log(err); }
    else { console.log(res); }
  }
);

client.call(
  {"jsonrpc": "2.0", "method": "decryptMessageByNumber", "params": [10], "id": 0},
  function (err, res) {
    // Did it all work ? 
    if (err) { console.log(err); }
    else { console.log(res); }
  }
);

