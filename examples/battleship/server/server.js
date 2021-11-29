const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const Web3 = require('web3');
const truffle_connect = require('./connection/app.js');
const bodyParser = require('body-parser');

const proofVerify = require('./privacy/proof-verify.js')

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use('/', express.static('public_static'));

app.get('/accounts', (req, res) => {
  truffle_connect.start(function (accounts) {
    res.send(accounts);
  })
});

app.post('/proof', async (req, res) => {
  fullProof = await proofVerify.fullProve(req.body);
  res.send(fullProof);
});

app.post('/verifyInputs', async(req, res) => {
  verifyInputs = await proofVerify.getVerifyProofInputs(req.body.proof, req.body.publicSignals);
  res.send(verifyInputs);
});

app.post('/verify', async(req, res) => {
  // TODO: destructure...
  verifyInputs = await proofVerify.getVerifyProofInputs(req.body.proof, req.body.publicSignals);
  truffle_connect.verify(verifyInputs.a, verifyInputs.b, verifyInputs.c, verifyInputs.input, () => {
    res.send('verified');
  });
})


app.listen(port, () => {
  truffle_connect.web3 = new Web3(new Web3.providers.HttpProvider("http://127.0.0.1:8545"));

  console.log("Express Listening at http://localhost:" + port);
});
