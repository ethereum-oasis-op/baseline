import cors from 'cors';
import express from 'express';

const router = express.Router();

router.get('/health-check', cors(), async (req, res) => res.sendStatus(200));

export default router;
