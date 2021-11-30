const {messagingServiceFactory, messagingProviderSocket} = require('../baseline/messaging')
const messagingProvider = messagingServiceFactory(messagingProviderSocket)

const { joinRoom, addListener, sendToRoom } = require('../utils/socket')

const joinGame = (id, game) => {
    joinRoom(id, game)
    addListener(id, 'game:move', (workgroup, message) => {
        console.log('Received:', msg)
        messagingProvider.publish(id, workgroup, message)
    })
}

const startGame = (id, game) => {
   sendToRoom(id, game, 'game:init', undefined, true)
}

module.exports = {
    joinGame,
    startGame
}