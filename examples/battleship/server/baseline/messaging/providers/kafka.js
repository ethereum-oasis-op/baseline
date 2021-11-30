/*
 * A kafka messaging provider.
 */

const publish = (id, subject, message) => {
    error('Not implemented')
}

const subscribe = (id, subject) => {
    error('Not implemented')
}

const unsubscribe = (id, subject) => {
    error('Not implemented')
}

module.exports = {
    publish,
    subscribe,
    unsubscribe
}