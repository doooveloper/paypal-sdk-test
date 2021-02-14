import express from 'express';
import axios from 'axios';

import { mandatoryFilter } from '../utils';

const router = express.Router();

router.get('/status/:id', async (req, res) => {
  mandatoryFilter('BASIC_AUTH_USERNAME')
  const token = await axios({
    url: `https://api-m.sandbox.paypal.com/v2/checkout/orders/${req.params.id}`,
    method: 'get',
    headers: {
      'Accept': 'application/json',
      'Accept-Language': 'en_US',
      'content-type': 'application/x-www-form-urlencoded',
    },
    auth: {
      username: mandatoryFilter('BASIC_AUTH_USERNAME'),
      password: mandatoryFilter('BASIC_AUTH_PASSWORD')
    }
  });
  res.status(200).send(token.data);
})

router.get('/token', async (req, res) => {
  const token = await axios({
    url: 'https://api-m.sandbox.paypal.com/v1/oauth2/token',
    method: 'post',
    headers: {
      'Accept': 'application/json',
      'Accept-Language': 'en_US',
      'content-type': 'application/x-www-form-urlencoded',
    },
    auth: {
      username: mandatoryFilter('BASIC_AUTH_USERNAME'),
      password: mandatoryFilter('BASIC_AUTH_PASSWORD')
    },
    params: {
      grant_type: 'client_credentials'
    }
  });

  res.status(200).json({ token: token.data });
})

router.post('/create-order', async (req, res) => {
  try {
    const createdOrder = await axios({
      url: 'https://api-m.sandbox.paypal.com/v2/checkout/orders',
      method: 'post',
      headers: {
        'Content-Type': 'application/json'
      },
      auth: {
        username: mandatoryFilter('BASIC_AUTH_USERNAME'),
        password: mandatoryFilter('BASIC_AUTH_PASSWORD')
      },
      data: {
        intent: 'CAPTURE',
        purchase_units: [
          {
            amount: {
              currency_code: 'USD',
              value: '100.00'
            }
          }
        ]
      }
    });

    res.status(200).send(createdOrder.data);
  } catch (err) {
    console.error(err);
  }
});

router.post('/complete', async (req, res) => {
  try {
    const completedOrder = await axios({
      url: `https://api-m.sandbox.paypal.com/v2/checkout/orders/${req.body.orderId}/capture`,
      method: 'post',
      headers: {
        'Content-Type': 'application/json' 
      },
      auth: {
        username: mandatoryFilter('BASIC_AUTH_USERNAME'),
        password: mandatoryFilter('BASIC_AUTH_PASSWORD')
      }
    });
    res.status(200).send(completedOrder.data);
  } catch (err) {
    console.error(err);
  }
});

router.post('/paypal/complete', async (req, res) => {
  await axios({
    url: `https://api-m.sandbox.paypal.com/v2/checkout/orders/${req.body.id}`,
    method: 'get',
    headers: {
      'Accept': 'application/json',
      'Accept-Language': 'en_US',
      'content-type': 'application/x-www-form-urlencoded',
    },
    auth: {
      username: mandatoryFilter('BASIC_AUTH_USERNAME'),
      password: mandatoryFilter('BASIC_AUTH_PASSWORD')
    }
  });
  res.status(200).send({ success: true });
});

export default router;