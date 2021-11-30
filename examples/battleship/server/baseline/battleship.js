const {messagingServiceFactory, messagingProviderMemory} = require('../baseline/messaging')
const messagingProvider = messagingServiceFactory(messagingProviderMemory)

const { joinRoom, addListener, sendToRoom } = require('../utils/socket')

const joinGame = (id, game) => {
    joinRoom(id, game)
    addListener(id, 'game:move', (workgroup, message) => {
        console.log('Received:', msg)
        messagingProvider.publish(workgroup, message)
    })
}

const startGame = (id, game) => {
   sendToRoom(id, game, 'game:init', undefined, true)
}

module.exports = {
    joinGame,
    startGame
}