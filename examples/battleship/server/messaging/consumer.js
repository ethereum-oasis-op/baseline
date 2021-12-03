const KafkaConfig = require('./config.js');
const eventType = require('./eventType.js');
let kafkaConfig = new KafkaConfig();
const consumer = kafkaConfig.consumer();

async function consume(callback) {
  consumer.connect();
  consumer.on('ready', () => {

    console.log('consumer ready..')
    consumer.subscribe(['battleship']);
    consumer.consume();
  
  }).on('data', async (data) => {
      //do something with the message recieved
      callback(eventType.fromBuffer(data.value))
    }
  )
}

module.exports = {
  consume
};