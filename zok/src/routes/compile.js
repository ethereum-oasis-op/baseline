import express from 'express';
import * as zokrates from '@eyblockchain/zokrates.js';

const router = express.Router();

router.post('/', async (req, res, next) => {
    const name = req.body;
    try {
        await zokrates.compile('./code/`${name}`', './output', '`${name}`_out');
        return res.status(201);
    } catch(err) {
        return next(err);
    }
});

export default router;
