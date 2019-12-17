import express from 'express';
import generateRFP from '../__fixtures__/rfp';

const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    const rfp = await generateRFP(10);
    return res.append('Total-Count', rfp.length).json(rfp);
  } catch (err) {
    return next(err);
  }
});

export default router;
