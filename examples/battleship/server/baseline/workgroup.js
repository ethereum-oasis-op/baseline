// Currently this file uses an ephemeral in-memory workgroup registry
// So all clients need to be connected to same node service.
// Should probably be replaced with something like redis

const express = require('express')
const router = express.Router()

const { organizationExists } = require('./organization')

const { joinGame, startGame } = require('./battleship')

const Randexp = require('randexp')
const codeRegExp = new Randexp(/([A-Z0-9]){4}/)

let workgroupRegistry = new Map()

router.post('/create', (req, res) => {
    if (!req.body.session || !organizationExists(req.body.session)) {
        return res.sendStatus(403)
    }


    let id = codeRegExp.gen()

    while (workgroupRegistry.has(id)) {
        id = codeRegExp.gen()
    }
    workgroupRegistry.set(id, 0)

    joinGame(req.body.session, id)

    res.json({id: id})
})
    
router.post('/join/:id', (req, res) => {
    if (!req.body.session || !organizationExists(req.body.session)) {
        return res.sendStatus(403)
    }

    const id = req.params.id

    if (workgroupRegistry.has(id)) {
        if (workgroupRegistry.get(id) === 0) {
            workgroupRegistry.set(id, 1)

            joinGame(req.body.session, id)
            startGame(req.body.session, id)

            return res.json({id: id})
        }

        return res.sendStatus(409)     // game already begun
    }

    res.sendStatus(404)
})

module.exports = {
    workgroupRouter: router
}