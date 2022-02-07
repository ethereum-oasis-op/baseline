const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const http = require('http')
const server = http.createServer(app)
const Web3 = require('web3');
const truffle_connect = require('./connection/truffle_connect.js');
const bodyParser = require('body-parser');
const cors = require('cors');

const { socketConnection } = require('./baseline/utils/socket');
socketConnection(server);

const { organizationRouter } = require('./baseline/organization');
const { workgroupRouter } = require('./baseline/workgroup');
const { battleshipRouter } = require('./baseline/battleship');

const KafkaConsumer = require('./baseline/messaging/consumer.js');
KafkaConsumer.consume().then(() => {
  console.log('consume start successful');
}).catch(err => {
  console.log('consume start err ', err);
})

app.use(cors());

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use('/', express.static('public_static'));

app.use('/api/organization', organizationRouter)
app.use('/api/workgroup', workgroupRouter)
app.use('/api/battleship', battleshipRouter)

server.listen(port, async () => {
  truffle_connect.web3 = new Web3(new Web3.providers.HttpProvider("http://ganache-cli:8545"));

  console.log("Express Listening at http://localhost:" + port);
});
