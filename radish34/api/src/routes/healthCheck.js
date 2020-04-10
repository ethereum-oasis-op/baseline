import cors from 'cors';
import express from 'express';

const router = express.Router();

router.get('/health', async (req, res) => res.sendStatus(200));

export default router;
