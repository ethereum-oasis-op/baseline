import express from 'express';

const router = express.Router();

router.post('/', async (req, res, next) => {
  try {
    console.log(req, res, next);
    return res.append('Total-Count', sku.length).json(sku);
  } catch (err) {
    return next(err);
  }
});

export default router;
