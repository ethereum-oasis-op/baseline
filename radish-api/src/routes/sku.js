import express from 'express';
import generateSKU from '../__fixtures__/sku';

const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    const sku = await generateSKU(10);
    return res.append('Total-Count', sku.length).json(sku);
  } catch (err) {
    return next(err);
  }
});

export default router;
