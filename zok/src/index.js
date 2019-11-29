import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import * as zokrates from '@eyblockchain/zokrates.js';
import compile from './routes/compile'

const app = express();

app.use(bodyParser.json({ limit: '2mb' }));
app.use(bodyParser.urlencoded({ limit: '2mb', extended: false }));

app.get('/healthcheck', (req, res) => res.sendStatus(200));
app.use('/compile', compile);

export default app;
module.exports = app;