import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import compile from './routes/compile';
import setup from './routes/setup';
import computeWitness from './routes/computeWitness';
import generateProof from './routes/generateProof';
import exportVerifier from './routes/exportVerifier';

const app = express();

app.use(cors());
app.use(bodyParser.json({ limit: '2mb' }));
app.use(bodyParser.urlencoded({ limit: '2mb', extended: false }));

app.get('/healthcheck', (req, res) => res.sendStatus(200));
app.use('/compile', compile);
app.use('/setup', setup);
app.use('/computeWitness', computeWitness);
app.use('/generateProof', generateProof);
app.use('/exportVerifier', exportVerifier);

export default app;
module.exports = app;
