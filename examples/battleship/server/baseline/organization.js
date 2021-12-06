// Currently this file uses an ephemeral in-memory org registry,
// so all clients need to be connected to same node service.
// Should probably be replaced with something like redis

// Also uses very insecure session ids, but security isn't major concern

const express = require('express')
const router = express.Router()

const { v4: uuidv4 } = require('uuid');

const { orgEventType } = require('./messaging/eventType.js')
const KafkaProducer = require('./messaging/producer.js');

const { orgRegistry } = require('./organizationRegistry')

router.get('/:id', (req, res) => {
    if (orgRegistry.has(req.params.id)) {
        return res.json({id: req.params.id, name: orgRegistry.get(req.params.id).name})
    }

    res.sendStatus(404)
})

router.post('', async (req, res) => {
    const id = uuidv4()

    if (req.body.name) {
        let org = { id, name: req.body.name }
        orgRegistry.set(id, org)

        const producer = new KafkaProducer('orgReg', orgEventType);
        await producer.queue(org, orgEventType)

        return res.json({id: id})
    }

    res.sendStatus(400)
})
    
module.exports = {
    organizationRouter: router,
}