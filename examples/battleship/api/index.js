import { app, properties } from './conf/conf.js'
import StatusCodes from 'http-status-codes'
import express from 'express'
import BattleshipMessageProducer from '../kafka/producer/index.js'

let router = express.Router()
let messageProducer = new BattleshipMessageProducer()

app.use(router)

//test end-point
router.get('/', async (req, res, next) => {
  return res.status(StatusCodes.OK).json({
    status: 'ok',
  })
})

//use this end-point to send message to kafka
router.post('/', async (req, res) => {
  messageProducer.queue(req.body.message)
})

let PORT = properties.get('app.port')
app.listen(PORT, () => {
  console.log(`App started at port ${PORT}`)
})

export default app