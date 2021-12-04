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
    console.log('group ', process.env.KAFKA_GROUP)
    return new Kafka.KafkaConsumer({
        'group.id': process.env.KAFKA_GROUP || 'group',
        'metadata.broker.list': process.env.KAFKA_BROKER || `localhost:9092`,
      }, {});
  }
}

module.exports = KafkaConfig;