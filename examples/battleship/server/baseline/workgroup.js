// Currently this file uses an ephemeral in-memory workgroup registry
// So all clients need to be connected to same node service.
// Should probably be replaced with something like redis

const express = require('express')
const router = express.Router()

const { v4: uuidv4 } = require('uuid');

const { organizationExists } = require('./organization')

const { joinGame, startGame } = require('./battleship')

const { workgroupEventType, orgEventType } = require('./messaging/eventType.js')
const KafkaProducer = require('./messaging/producer.js');

const truffle_connect = require('../connection/truffle_connect')

const ID_LENGTH = 4

let workgroupRegistry = new Map()

router.post('', async (req, res) => {
    if (!req.body.session || !organizationExists(req.body.id)) {
        return res.sendStatus(403)
    }

    await truffle_connect.deploy(async function (shieldContractAddress) {
        let id = uuidv4().slice(0, ID_LENGTH).toUpperCase()
        while(workgroupRegistry.has(id)) {
            id = uuidv4().slice(0, ID_LENGTH).toUpperCase()
        }
        
        let workgroup = {
            id: id,
            players: [req.body.id],
            shieldContractAddress
        }
        workgroupRegistry.set(id, workgroup)

        const producer = new KafkaProducer('workgroupReg', workgroupEventType);
        await producer.queue(workgroup, workgroupEventType)

        joinGame(req.body.session, id)

        res.json({id: id})
    })
})
    
router.post('/join/:id', async (req, res) => {
    if (!req.body.session || !organizationExists(req.body.id)) {
        return res.sendStatus(403)
    }

    const id = req.params.id

    if (workgroupRegistry.has(id)) {
        let workgroup = workgroupRegistry.get(id)

        if (workgroup.players.length == 1) {
            if (workgroup.players[0] !== req.body.id) {
                workgroup = {
                    id: workgroup.id,
                    players: [
                        workgroup.players[0],
                        req.body.id
                    ]
                }
                workgroupRegistry.set(id, workgroup)
    
                const producer = new KafkaProducer('workgroupReg', workgroupEventType);
                await producer.queue(workgroup, workgroupEventType)
    
                joinGame(req.body.session, id)
                startGame(workgroup)
    
                return res.json({id: id})
            }

            return res.status(409).json({ error: 'User in workgroup'})
        }

        return res.status(409).json({ error: 'Workgroup full' })
    }

    res.sendStatus(404)
})

const updateWorkgroup = (workgroup) => {
    if (workgroupRegistry.has(workgroup.id)) {
        console.log(`updating workgroup with id ${workgroup.id}`)

        workgroupRegistry.set(workgroup.id, workgroup)

        if (workgroup.players.length === 2) {
            startGame(workgroup)
        }

        return;
    }

    console.log('adding new workgroup ', workgroup)
    workgroupRegistry.set(workgroup.id, workgroup)
}

const getShieldAddress = (workgroupId) => {
    const workgroup = workgroupRegistry.get(workgroupId)

    if (!workgroup) {
        console.log(`getShieldAddress - workgroup ${workgroupId} not found`)
        return;
    }

    return workgroup.shieldContractAddress;
}

module.exports = {
    workgroupRouter: router,
    updateWorkgroup,
    getShieldAddress
}