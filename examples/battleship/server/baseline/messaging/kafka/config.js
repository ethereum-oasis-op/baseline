import Kafka from 'node-rdkafka';

/**
 * A general purpose KafkaConfig class written on top of node-rdkafka
 * It provides the producer and consumer config through two methods  - 
 * 1. producer
 * 2. consumer
 * 
 * @author : Manik Jain
 */
export default class KafkaConfig {

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