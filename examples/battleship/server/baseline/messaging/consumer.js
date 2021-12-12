const KafkaConfig = require('./config.js');
const { orgEventType, proofEventType, targetEventType, gameEventType, workgroupEventType } = require('./eventType.js');
let kafkaConfig = new KafkaConfig();

const { insertOrg } = require('../organizationRegistry')
const { updateGame, handleGameEvent } = require('../game')
const { updateWorkgroup } = require('../workgroupRegistry')

async function consume() {
  const stream = kafkaConfig.consumer();

  stream.on('data', function(data) {
    console.log('message received', data);
    switch(data.topic) {
      case 'orgReg':
        insertOrg(orgEventType.fromBuffer(data.value))
        break;
      case 'workgroupReg': 
        updateWorkgroup(workgroupEventType.fromBuffer(data.value))
        break;
      case 'proof':
        const proofMessage = proofEventType.fromBuffer(data.value);
        console.log('proof message received ', proofMessage)
        handleGameEvent('proof', proofMessage)
        break;
        
      case 'battleship': 
        const targetMessage = targetEventType.fromBuffer(data.value);
        console.log('target message received ', targetEventType.fromBuffer(data.value))
        handleGameEvent('target', targetMessage)
        break;

      case 'game':
        const game = gameEventType.fromBuffer(data.value)
        console.log('game message received ', game)
        updateGame(game)
        break;

      default:
        console.warn('unsupported topic received ', data.topic)
      }
  });
}

module.exports = {
  consume
};