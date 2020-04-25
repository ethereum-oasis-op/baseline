import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import generateProof from './routes/generateProof';
import generateKeys from './routes/generateKeys';
import vk from './routes/vk';

const app = express();

app.use(cors());
app.use(bodyParser.json({ limit: '2mb' }));
app.use(bodyParser.urlencoded({ limit: '2mb', extended: false }));

app.get('/health', (req, res) => res.sendStatus(200));
app.use('/generate-keys', generateKeys);
app.use('/generate-proof', generateProof);
app.use('/vk', vk);

export default app;
module.exports = app;
