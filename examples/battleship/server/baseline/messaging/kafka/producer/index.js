import eventType from '../eventType.js';
import KafkaConfig from '../config.js';

let kafkaConfig = new KafkaConfig();
const stream = kafkaConfig.producer();

/**
 * 
 * BattleshipMessageProducer
 * 
 * It accepts the Kafka message being produced by the front-end
 * and pushes it to the Kakfa queue for further processing
 * 
 * @author : Manik Jain
 * 
 */
export default class BattleshipMessageProducer {

    constructor() {
        stream.on('error', (err) => {
            console.error('Error in Kafka stream')
            console.error(err)
        })
    }

    async queue(message) {
        console.log(`Queueing new message....${JSON.stringify(message)}`)
        const success = await stream.write(eventType.toBuffer(message));
        success ? console.log(`message queued (${JSON.stringify(message)})`) : 
            console.log('Too many messages in the queue already..');
    }
}