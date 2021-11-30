const socketProvider = require('./providers/socket')
const kafkaProvider = require('./providers/kafka')

const messagingProviderSocket = 'socket'
const messagingProviderKafka = 'kafka'

const messagingServiceFactory = (provider) => {
    let service

    switch(provider) {
        case messagingProviderSocket:
            service = socketProvider
            break
        case messagingProviderKafka:
            service = kafkaProvider
            break
        default:
            throw new Error('messaging service provider required')
    }

    return service
}

module.exports = {
    messagingServiceFactory,
    messagingProviderSocket,
    messagingProviderKafka
}