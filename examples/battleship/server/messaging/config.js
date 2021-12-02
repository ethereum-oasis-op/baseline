const Kafka = require('node-rdkafka');

class KafkaConfig {
  producer() {
    return Kafka.Producer.createWriteStream({
      'metadata.broker.list' : 'localhost:9092'
      }, 
      {}, {
          topic : 'battleship'
      });
  }

  consumer() {
    return new Kafka.KafkaConsumer({
        'group.id': 'kafka',
        'metadata.broker.list': 'localhost:9092',
      }, {});
  }
}

module.exports = KafkaConfig;