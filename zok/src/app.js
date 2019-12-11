import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import computeWitness from './routes/computeWitness';
import generateProof from './routes/generateProof';
import generateKeys from './routes/generateKeys';

const app = express();

app.use(cors());
app.use(bodyParser.json({ limit: '2mb' }));
app.use(bodyParser.urlencoded({ limit: '2mb', extended: false }));

app.get('/healthcheck', (req, res) => res.sendStatus(200));
app.use('/generateKeys', generateKeys);
app.use('/computeWitness', computeWitness);
app.use('/generateProof', generateProof);

export default app;
module.exports = app;
