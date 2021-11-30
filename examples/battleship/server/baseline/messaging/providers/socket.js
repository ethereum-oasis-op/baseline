/*
 * A simple in-memory messaging provider.
 * Requires all clients to be connected to same server instance
 */

const { joinRoom, leaveRoom, sendToRoom } = require('../../../utils/socket')

const publish = (id, subject, message) => {
    sendToRoom(id, subject, 'message', message)
}

const subscribe = (id, subject) => {
    joinRoom(id, subject)
}

const unsubscribe = (id, subject) => {
    leaveRoom(id, subject)
}

module.exports = {
    publish,
    subscribe,
    unsubscribe
}