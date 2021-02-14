const express = require('express');
const axios = require('axios');
const cors = require('cors');

(async () => {
  require('dotenv').config();
  const app = express();

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cors());

  app.set('views', `${__dirname}/views`);
  app.set('view engine', 'html');

  app.get('/checkout', (req, res) => {
    res.render('checkout');
  });

  app.get('subscription', (req, res) => {
    res.render('subscription');
  });

  app.get('/auth', async (req, res) => {
    const test = await axios({
      url: 'https://api-m.sandbox.paypal.com/v2/checkout/orders/28H73047PY200770M/authorize',
      method: 'post',
      headers: {
        'Content-Type': 'application/json'
      },
      auth: {
        username: process.env.BASIC_AUTH_USERNAME,
        password: process.env.BASIC_AUTH_PASSWORD
      }
    });

    res.status(200).send(test.data);
  });

  app.get('/status/:id', async (req, res) => {
    console.log(req.path.id);
    const token = await axios({
      url: `https://api-m.sandbox.paypal.com/v2/checkout/orders/${req.params.id}`,
      method: 'get',
      headers: {
        'Accept': 'application/json',
        'Accept-Language': 'en_US',
        'content-type': 'application/x-www-form-urlencoded',
      },
      auth: {
        username: process.env.BASIC_AUTH_USERNAME,
        password: process.env.BASIC_AUTH_PASSWORD
      }
    });
    res.status(200).send(token.data);
  })

  app.get('/token', async (req, res) => {
    const token = await axios({
      url: 'https://api-m.sandbox.paypal.com/v1/oauth2/token',
      method: 'post',
      headers: {
        'Accept': 'application/json',
        'Accept-Language': 'en_US',
        'content-type': 'application/x-www-form-urlencoded',
      },
      auth: {
        username: process.env.BASIC_AUTH_USERNAME,
        password: process.env.BASIC_AUTH_PASSWORD
      },
      params: {
        grant_type: 'client_credentials'
      }
    });

    res.status(200).json({ token: token.data });
  })

  app.all('/create-order', async (req, res) => {
    console.log('into test!!!');
    try {
      const test = await axios({
        url: 'https://api-m.sandbox.paypal.com/v2/checkout/orders',
        method: 'post',
        headers: {
          'Content-Type': 'application/json'
        },
        auth: {
          username: process.env.BASIC_AUTH_USERNAME,
        password: process.env.BASIC_AUTH_PASSWORD
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
  
      res.status(200).send(test.data);
    } catch (err) {
      console.error(err);
    }
  });

  app.all('/complete', async (req, res) => {
    try {
      const test = await axios({
        url: `https://api-m.sandbox.paypal.com/v2/checkout/orders/${req.body.orderId}/capture`,
        method: 'post',
        headers: {
          'Content-Type': 'application/json' 
        },
        auth: {
          username: process.env.BASIC_AUTH_USERNAME,
        password: process.env.BASIC_AUTH_PASSWORD
        }
      });
      res.status(200).send(test.data);
    } catch (err) {
      console.error(err);
    }
  });

  app.post('/paypal/complete', async (req, res) => {
    const order = await axios({
      url: `https://api-m.sandbox.paypal.com/v2/checkout/orders/${req.body.id}`,
      method: 'get',
      headers: {
        'Accept': 'application/json',
        'Accept-Language': 'en_US',
        'content-type': 'application/x-www-form-urlencoded',
      },
      auth: {
        username: process.env.BASIC_AUTH_USERNAME,
        password: process.env.BASIC_AUTH_PASSWORD
      }
    });
    res.status(200).send({ success: true });
  });

  app.listen(3000, () => console.log('listen 3000'));
})();