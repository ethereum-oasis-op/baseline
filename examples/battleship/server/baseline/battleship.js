const express = require('express')
const router = express.Router()

const { hash } = require('./utils/hash')

const { fullProve, getVerifyProofInputs } = require('./privacy/proof-verify')
const truffle_connect = require('../connection/truffle_connect')

const { targetEventType, proofEventType, gameEventType } = require('./messaging/eventType')
const KafkaProducer = require('./messaging/producer');

const { games, userInGame, updateGame } = require('./game')


router.get('/:id', (req, res) => {
  if (games.has(req.params.id)) {
    let game = games.get(req.params.id)

    return res.json({ game })
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

      if (player.hash !== undefined && player.hash > 0)
        return res.status(409).send('Player hash already set.')

      const boardHash = await hash(req.body);

      player.hash = boardHash

      updateGame(game)

      const gameProducer = new KafkaProducer('game', gameEventType);
      await gameProducer.queue({ id: game.id, shieldContractAddress: game.shieldContractAddress, players: game.players });
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

    return
  }

  res.sendStatus(409)
})

router.post('/verify', async (req, res) => {
  verifyInputs = await getVerifyProofInputs(req.body.proof, req.body.publicSignals);
  const shieldAddress = games.get(req.body.gameId).shieldContractAddress
  await truffle_connect.verify(verifyInputs.a, verifyInputs.b, verifyInputs.c, verifyInputs.public, shieldAddress, () => {
    res.send('verified');
  });
})

module.exports = {
  battleshipRouter: router,
}