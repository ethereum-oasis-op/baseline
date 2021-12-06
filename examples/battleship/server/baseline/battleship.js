const express = require('express')
const router = express.Router()

const { getIO, getSocket } = require('./utils/socket')
const { hash } = require('./utils/hash')

const { fullProve, getVerifyProofInputs } = require('./privacy/proof-verify')
const truffle_connect = require('../connection/truffle_connect')

let games = new Map()

const { targetEventType, proofEventType, gameEventType } = require('./messaging/eventType')
const KafkaProducer = require('./messaging/producer');

const userInGame = (id, game) => {
    return games.has(game) && games.get(game).players.map(player => player.id).includes(id)
}

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


    console.log(`starting game with ID #${workgroup.id}`)
    updateGame(game)
}

router.get('/:id', (req, res) => {
    if (games.has(req.params.id)) {
        let game = games.get(req.params.id)
        
        return res.json({game})
    }

    res.sendStatus(404)
})


router.put('/hash/:id', async (req, res) => {
    const id = req.body.id
    const gameID = req.params.id

    if (games.has(gameID)) {
        if (userInGame(id, gameID)) {
            let game = games.get(gameID)

            const player = game.players.find(player => player.id === id)
            
            if (player.hash !== undefined)
                return res.status(409).send('Player hash already set.')

            const boardHash = await hash(req.body);

            player.hash = boardHash

            updateGame(game) // remove if consumer consumes own messages

            const gameProducer = new KafkaProducer('game', gameEventType);
            await gameProducer.queue({id: game.id, players: game.players});
            return res.sendStatus(200)
        }

        return res.status(403).send('Action not permitted.')
    }

    res.status(404).send(`Game #${game} does not exist`)
})

router.post('/target', async (req, res) => {
  const targetProducer = new KafkaProducer('battleship', targetEventType);
  await targetProducer.queue(req.body);
  res.sendStatus(200)

  handleGameEvent('target', req.body) // probably remove once kafka consumer/producer issues get sorted out
})

router.post('/proof', async (req, res) => {
  const inputSignals = {
    shipX: req.body.shipX,
    shipY: req.body.shipY,
    shipO: req.body.shipO,
    // TODO: is this passed in or fetched from state?
    shipHash: req.body.shipHash,
    targetX: req.body.targetX,
    targetY: req.body.targetY
  }
  const { proof, publicSignals } = await fullProve(inputSignals)

  console.log(req.body.result, parseInt(publicSignals[0]))

  if (parseInt(publicSignals[0]) === req.body.result) {
    const proofMsg = {
        proof,
        publicSignals,
        gameId: req.body.gameId,
        playerId: req.body.playerId
      }
      const proofProducer = new KafkaProducer('proof', proofEventType); 
      await proofProducer.queue(proofMsg);
      res.sendStatus(200);
    
      handleGameEvent('proof', proofMsg) // probably remove once kafka consumer/producer issues get sorted out

      return
  }
  
  res.sendStatus(409)
})

router.post('/verify', async(req, res) => {
  verifyInputs = await getVerifyProofInputs(req.body.proof, req.body.publicSignals);
  await truffle_connect.verify(verifyInputs.a, verifyInputs.b, verifyInputs.c, verifyInputs.public, req.body.gameId, () => {
    res.send('verified');
  });
})

const updateGame = (game) => {
    const gameExisted = games.has(game.id)

    games.set(game.id, game)

    getIO().to(game.id).emit(gameExisted ? 'game:update' : 'game:init', game)
}

const handleGameEvent = (type, event) => {
    if (event.gameId === undefined) {
        console.error(`Game event ${event} does not specify a gameId.`)
    }

    getIO().to(event.gameId).emit('game:event', {type, data: event})
}

module.exports = {
    battleshipRouter: router,
    joinGame,
    startGame,
    updateGame,
    handleGameEvent
}