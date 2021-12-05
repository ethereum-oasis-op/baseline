const KafkaConfig = require('./config.js');
const { orgEventType, proofEventType, targetEventType, gameEventType } = require('./eventType.js');
let kafkaConfig = new KafkaConfig();
const consumer = kafkaConfig.consumer();

const { insertOrg } = require('../organization')
const { updateGame } = require('../battleship')

const { getVerifyProofInputs } = require('../privacy/proof-verify')
const truffle_connect = require('../../connection/truffle_connect');

async function consume() {
  consumer.connect();
  consumer.on('ready', () => {

    console.log('consumer ready..')
    consumer.subscribe(['battleship', 'orgReg', 'workgroupReg', 'game', 'proof']);
    consumer.consume();
  
  }).on('data', async (data) => {
    console.log('received', data)
    const currentPlayerId = process.env.PLAYER_ID;
    switch(data.topic) {
      case 'orgReg':
        insertOrg(orgEventType.fromBuffer(data.value))
        break;
      case 'proof':
        const proofMessage = proofEventType.fromBuffer(data.value);
        if (proofMessage.playerId === currentPlayerId) {
          console.log('proof message received ', proofMessage)
          verifyInputs = await getVerifyProofInputs(proofMessage.proof, proofMessage.publicSignals);
          truffle_connect.verify(verifyInputs.a, verifyInputs.b, verifyInputs.c, verifyInputs.input, () => {
            // TODO: push information to frontend
            console.log('verified!')
          });
        }
        break;
      case 'battleship': 
        const targetMessage = targetEventType.fromBuffer(data.value);
        if (targetMessage.playerId === currentPlayerId) {
          console.log('target message received ', targetEventType.fromBuffer(data.value))
          // TODO: push information to frontend, so frontend can know to call /proof endpoint
        }
        break;
      case 'game':
        const game = gameEventType.fromBuffer(data.value)
        console.log('game message received ', game)
        updateGame(game)
        break;

      default:
        console.warn('unsupported topic received ', data.topic)
      }
    }
  )
}

module.exports = {
  consume
};