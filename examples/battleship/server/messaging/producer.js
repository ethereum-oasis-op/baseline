const eventType = require('./eventType.js');
const KafkaConfig = require('./config.js');

let kafkaConfig = new KafkaConfig();
const stream = kafkaConfig.producer();

class BattleshipMessageProducer {
  constructor() {
    stream.on('error', (err) => {
        console.error('Error in Kafka stream')
        console.error(err);
    });
  }

  async queue(message) {
    console.log(`Queueing new message....${JSON.stringify(message)}`)
    const success = await stream.write(eventType.toBuffer(message));
    success ? console.log(`message queued (${JSON.stringify(message)})`) : 
        console.log('Too many messages in the queue already..');
  }
}

module.exports = BattleshipMessageProducer;