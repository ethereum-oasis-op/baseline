import CardonMessageProducer from './producer/index.js'
let cardonMessageProducer = new CardonMessageProducer();

/** 
 * This will be the front-end message receiver 
 * that will queue message to the Kafka queue 
 * via BattleshipMessageProducer
 * 
 * @author : Manik Jain
 */

setInterval(() => {
    const message = {
        category: 'BASELINE',
        name: 'BATTLESHIP'
    };
    cardonMessageProducer.queue(message);
  }, 3000);