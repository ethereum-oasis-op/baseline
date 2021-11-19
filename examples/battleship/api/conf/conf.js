import express from 'express'
import morgan from 'morgan'
import fs from 'fs'
import path from 'path'
import propertiesReader from 'properties-reader'
import cors from 'cors'

let app = express();
const properties = propertiesReader(path.resolve('./properties.file'));

let accessLogStream = fs.createWriteStream(path.resolve(properties.get('logger.access')), {
    flags: 'a'
})

app.use(express.json());
app.use(cors())

app.use(morgan('combined', {
    stream: accessLogStream
}))

function getRouter() {
    return express.Router()
}

export {
    app,
    getRouter as router,
    properties
}