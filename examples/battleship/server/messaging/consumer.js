const KafkaConfig = require('./config.js');
const { orgEventType } = require('./eventType.js');
let kafkaConfig = new KafkaConfig();
const consumer = kafkaConfig.consumer();

const { insertOrg } = require('../baseline/organization.js')

async function consume(callback) {
  consumer.connect();
  consumer.on('ready', () => {

    console.log('consumer ready..')
    consumer.subscribe(['battleship', 'orgReg']);
    consumer.consume();
  
  }).on('data', async (data) => {
      if (data.topic === 'orgReg') {
        insertOrg(orgEventType.fromBuffer(data.value))
      }
      //do something with the message recieved
      callback(orgEventType.fromBuffer(data.value))
    }
  )
}

module.exports = {
  consume
};