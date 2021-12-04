
// const { joinRoom, addListener, sendToRoom } = require('../utils/socket')
const { get } = require('jquery')
const { getIO, getSocket } = require('../utils/socket')
const workgroup = require('./workgroup')

const joinGame = (session, game) => {
    const socket = getSocket(session)

    socket.join(game)

    socket.on('game:move', (workgroup, message) => {
        console.log('Received:', msg)
    })
}

const startGame = (game) => {
    console.log(`starting game with ID #${game}`)
    getIO().to(game).emit('game:init')
    // sendToRoom(session, game, 'game:init', undefined, true)
}

module.exports = {
    joinGame,
    startGame
}