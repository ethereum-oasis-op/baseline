const express = require('express');
const app = express();
const port = 3000 || process.env.PORT;
const Web3 = require('web3');
const truffle_connect = require('./connection/app.js');
const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/', express.static('public_static'));

app.get('/accounts', (req, res) => {
  truffle_connect.start(function (accounts) {
    res.send(accounts);
  })
});

app.get('/verify', (req, res) => {
  // TODO: find a better way to init account...
  console.log(req.body);
  const a = [
    '20263960274102488267886851551694800323743247642289474360076505230261378263785',
    '19671581336947435832464984428324081579390014257241520924870656606744389928140'
  ];
  const b =  [
    [
      '20424184833488172536950733175521107857035483822105426266085078155330272423404',
      '5922944039016555408023406177868351883607026714750839714600950037621377900414'
    ],
    [
      '17414522668497878964579920698524904993983955973896239826015777849600225511025',
      '15345189510968126756832662234520170727702922482186305705852669726872308452538'
    ]
  ];
  const c = [
    '10465782367418441551399110770453886130044836386138587260273854752895755146311',
    '17845296183135454742212872545917022695762434943596679646082235326115232456823'
  ];

  const input =  [
    '0',
    '13237994968088518996174628563664036318752461915430710199584736253105877115214',
    '3896038829480439603285414103495279618594728622241080088713059240472022064007',
    '1',
    '2'
  ]

  truffle_connect.verify(a, b, c, input, () => {
    res.send('verified');
  });

});

app.listen(port, () => {
  truffle_connect.web3 = new Web3(new Web3.providers.HttpProvider("http://127.0.0.1:8545"));

  console.log("Express Listening at http://localhost:" + port);
});
