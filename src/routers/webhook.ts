import express from 'express';

const router = express.Router();

router.post('/test', (req, res) => {
  console.log('into webhook');
  console.log(req.body);

  res.sendStatus(200);
});

export default router;