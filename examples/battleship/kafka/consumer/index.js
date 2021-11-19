/**
 * 
 * A general purpose Kakfa listener.
 * It listens to the message being produced by the Kafka Producer
 * 
 * @usage  : Kindly keep this node spinning 
 *           in order to listen to the message 
 *           as and when they are pushed
 * 
 * @author : Manik Jain
 */
import KafkaConfig from '../config.js'
import _ from 'lodash';

let kafkaConfig = new KafkaConfig();
const consumer = kafkaConfig.consumer();

( 
  async function consume() {
  consumer.connect();
  consumer.on('ready', () => {

    console.log('consumer ready..')
    consumer.subscribe(['battleship']);
    consumer.consume();
  
  }).on('data', async (data) => 
    
    //do somehting with the message recieved
    await process(data)
  )
})();

async function process(data) {
  console.log(data)
}