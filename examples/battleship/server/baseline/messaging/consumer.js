const KafkaConfig = require('./config.js');
const { orgEventType, proofEventType, targetEventType } = require('./eventType.js');
let kafkaConfig = new KafkaConfig();
const consumer = kafkaConfig.consumer();

const { insertOrg } = require('../organization.js')

async function consume() {
  consumer.connect();
  consumer.on('ready', () => {

    console.log('consumer ready..')
    consumer.subscribe(['battleship', 'orgReg', 'proof']);
    consumer.consume();
  
  }).on('data', async (data) => {
    console.log('message received ', data)
    switch(data.topic) {
      case 'orgReg':
        insertOrg(orgEventType.fromBuffer(data.value))
        break;
      case 'proof':
        console.log('proof message received ', proofEventType.fromBuffer(data.value))
        break;
      case 'battleship': 
        console.log('target message received ', targetEventType.fromBuffer(data.value))
        break;
      default:
        console.warn('unsupported topic received ', data.topic)
      }
    }
  )
}

module.exports = {
  consume
};