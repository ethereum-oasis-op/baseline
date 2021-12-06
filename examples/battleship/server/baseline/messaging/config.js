const Kafka = require('node-rdkafka');

class KafkaConfig {
  producer(topic = 'battleship') {
    return Kafka.Producer.createWriteStream({
      'metadata.broker.list' : process.env.KAFKA_BROKER || 'localhost:9092'
      }, 
      {}, {
          topic
      });
  }

  consumer() {
    return Kafka.KafkaConsumer.createReadStream({
      'group.id': process.env.KAFKA_GROUP || 'group',
      'metadata.broker.list': process.env.KAFKA_BROKER || `localhost:9092`,
    }, {}, {
      topics: ['battleship', 'orgReg', 'workgroupReg', 'game', 'proof']
    });
  }
}

module.exports = KafkaConfig;