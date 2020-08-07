const axios = require('axios');
let data = JSON.stringify(
  {"jsonrpc":"2.0","method":"eth_sendRawTransaction","params":["${TRANSACTION}"],"id":1});

let config = {
  method: 'post',
  url: 'http://127.0.0.1:8545',
  headers: { 
    'Content-Type': 'application/json'
  },
  data : data
};

axios(config)
.then((response) => {
  console.log(JSON.stringify(response.data));
})
.catch((error) => {
  console.log(error);
});