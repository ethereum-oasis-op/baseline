import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import healthCheck from './routes/healthCheck';
import rfq from './routes/rfq';
import partner from './routes/partner';
import sku from './routes/sku';

const app = express();

// cors & body parser middleware should come before any routes are handled
app.use(cors({ exposedHeaders: ['Total-Count', 'Report-Total'] }));
app.use(bodyParser.json({ limit: '2mb' }));
app.use(bodyParser.urlencoded({ limit: '2mb', extended: false }));

// Routes
app.use('/health-check', healthCheck);
app.use('/rfq', rfq);
app.use('/partner', partner);
app.use('/sku', sku);

export default app;
module.exports = app;
