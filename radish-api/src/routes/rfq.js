import express from 'express';
import generateRFQ from '../__fixtures__/rfq';

const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    const rfq = await generateRFQ(10);
    return res.append('Total-Count', rfq.length).json(rfq);
  } catch (err) {
    return next(err);
  }
});

export default router;
