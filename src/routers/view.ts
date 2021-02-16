import express from 'express';

const router = express.Router();

router.get('/checkout', (req, res) => {
  res.render('checkout');
});

router.get('/subscription', (req, res) => {
  res.render('subscription');
});

export default router;