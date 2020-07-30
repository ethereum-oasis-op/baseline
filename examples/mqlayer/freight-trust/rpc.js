const axios = require('axios');
let data = JSON.stringify({"jsonrpc":"2.0","method":"net_enode","params":[],"id":1});

let config = {
  method: 'post',
  url: 'http://18.216.213.235:8545',
  headers: { 
    'Content-Type': 'application/json'
  },
  timeout: 600,
  maxRedirects: 0,
  data : data
};

axios(config)
.then((response) => {
  console.log(JSON.stringify(response.data));
})
.catch((error) => {
  console.log(error);
});