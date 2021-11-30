/*
 * A simple in-memory messaging provider.
 * Requires all clients to be connected to same server instance
 */



const publish = (subject, message) => {
    error('Not implemented')
}

const subscribe = (subject, handler) => {
    error('Not implemented')
}

const unsubscribe = (subject) => {
    error('Not implemented')
}

module.exports = {
    publish,
    subscribe,
    unsubscribe
}