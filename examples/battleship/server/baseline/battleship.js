const express = require('express')
const router = express.Router()

const { getIO, getSocket } = require('./utils/socket')

let games = new Map()

const { targetEventType, proofEventType, orgEventType } = require('./messaging/eventType')
const KafkaProducer = require('./messaging/producer');

const joinGame = (session, game) => {
  const socket = getSocket(session)

  socket.join(game)

  socket.on('game:move', (workgroup, message) => {
    console.log('Received:', msg)
  })
}

const startGame = (workgroup) => {
    
    let game = {
        id: workgroup.id,
        players: workgroup.players.map(id => ({id})),
        actions: []
    }

    games.set(workgroup.id, game)

    console.log(`starting game with ID #${workgroup.id}`)
    getIO().to(workgroup.id).emit('game:init', game.id)
}

router.get('/:id', (req, res) => {
    if (games.has(req.params.id)) {
        let game = games.get(req.params.id)
        
        return res.json({game})
    }

    res.sendStatus(404)
})

router.post('/target', async (req, res) => {
  const targetProducer = new KafkaProducer('battleship', targetEventType);
  await targetProducer.queue(req.body);
  res.sendStatus(200)
})

router.post('/proof', async (req, res) => {
  const proofProducer = new KafkaProducer('proof', proofEventType); 
  await proofProducer.queue(req.body);
  res.sendStatus(200);
})

router.post('/verify', async(req, res) => {
  // TODO: destructure...
  verifyInputs = await proofVerify.getVerifyProofInputs(req.body.proof, req.body.publicSignals);
  truffle_connect.verify(verifyInputs.a, verifyInputs.b, verifyInputs.c, verifyInputs.input, () => {
    res.send('verified');
  });
})


module.exports = {
    battleshipRouter: router,
    joinGame,
    startGame
}