import express from 'express';
import axios from 'axios';
import { mandatoryFilter } from '../utils';

const router = express.Router();

router.all('/product/create', async (req, res) => {
  try {
    console.log('into create product');
    const createdProduct = await axios({
      url: 'https://api-m.sandbox.paypal.com/v1/catalogs/products',
      method: 'post',
      headers: {
        'Content-Type': 'application/json'
      },
      auth: {
        username: mandatoryFilter('BASIC_AUTH_USERNAME'),
        password: mandatoryFilter('BASIC_AUTH_PASSWORD')
      },
      data: {
        name: 'test product',
        type: 'DIGITAL', // PHYSICAL, DIGITAL, SERVICE 
      }
    });

    console.log(createdProduct.data);

    res.status(200).json(createdProduct.data);
  } catch (err) {
    console.error(err);
  }
});

export default router;