import express from 'express';

const router = express.Router();

router.post('/test', (req, res) => {
  console.log('into webhook');
  console.dir(req.body, { depth: null });

  res.sendStatus(200);
});

export default router;