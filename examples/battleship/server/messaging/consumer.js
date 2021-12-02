const KafkaConfig = require('./config.js');

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
      callback(data)
    }
  )
}

module.exports = {
  consume
};