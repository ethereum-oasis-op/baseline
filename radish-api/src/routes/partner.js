import express from 'express';
import generatePartner from '../__fixtures__/partner';

const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    const partner = await generatePartner(10);
    return res.append('Total-Count', partner.length).json(partner);
  } catch (err) {
    return next(err);
  }
});

export default router;
