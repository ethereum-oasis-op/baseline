const axios = require('axios');
let data = JSON.stringify({"jsonrpc":"2.0","method":"eth_sendRawTransaction","params":["0xf86a018203e882520894f17f52151ebef6c7334fad080c5704d77216b732896c6b935b8bbd400000801ba093129415f03b4794fd1512e79ee7f097e4271f66721020f8407aac92179893a5a0451b875d89721ec98be55201092980b0a87bb1c48507fccb86da713596b2a09e"],"id":1});

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