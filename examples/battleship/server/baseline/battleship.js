const express = require('express')
const router = express.Router()

const { getIO, getSocket } = require('../utils/socket')

let games = new Map()

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

module.exports = {
    battleshipRouter: router,
    joinGame,
    startGame
}