const memoryProvider = require('./providers/memory')
const kafkaProvider = require('./providers/kafka')

const messagingProviderMemory = 'memory'
const messagingProviderKafka = 'kafka'

const messagingServiceFactory = (provider) => {
    let service

    switch(provider) {
        case messagingProviderMemory:
            service = memoryProvider
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
    messagingProviderMemory,
    messagingProviderKafka
}