const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const http = require('http')
const server = http.createServer(app)
const Web3 = require('web3');
const truffle_connect = require('./connection/app.js');
const bodyParser = require('body-parser');

const KafkaProducer = require('./messaging/producer.js');
const KafkaConsumer = require('./messaging/consumer.js');

const { socketConnection } = require('./utils/socket')
socketConnection(server)

const proofVerify = require('./privacy/proof-verify.js')

const { organizationRouter } = require('./baseline/organization')
const { workgroupRouter } = require('./baseline/workgroup')


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use('/', express.static('public_static'));

app.use('/organization', organizationRouter)
app.use('/workgroup', workgroupRouter)

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

app.post('/testMsg', async(req, res) => {
  const producer = new KafkaProducer();
  await producer.queue(req.body.message)
  res.send('msg queued')
})


server.listen(port, async () => {
  truffle_connect.web3 = new Web3(new Web3.providers.HttpProvider("http://ganache-cli:8545"));

  await KafkaConsumer.consume((data) => {
    console.log('message received ', data)
  });

  console.log("Express Listening at http://localhost:" + port);
});
