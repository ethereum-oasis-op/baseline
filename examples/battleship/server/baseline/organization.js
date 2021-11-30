// Currently this file uses an ephemeral in-memory org registry,
// so all clients need to be connected to same node service.
// Should probably be replaced with something like redis

// Also uses very insecure session ids, but security isn't major concern

const express = require('express')
const router = express.Router()

const orgRegistry = new Map()

router.get('/:id', (req, res) => {
    if (orgRegistry.has(req.params.id)) {
        return res.json({id: req.params.id, name: orgRegistry.get(req.params.id)})
    }

    res.sendStatus(404)
})

router.post('/register/:id', (req, res) => {
    const id = req.params.id

    if (req.body.name) {
        orgRegistry.set(id, req.body.name)

        return res.json({id: id})
    }

    res.sendStatus(400)
})

const organizationExists = (id) => {
    return orgRegistry.has(id)
}
    
module.exports = {
    organizationRouter: router,
    organizationExists
}