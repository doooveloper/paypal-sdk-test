import express from 'express';
import axios from 'axios';
import { mandatoryFilter } from '../utils';

const router = express.Router();

router.all('/product/create', async (req, res) => {
  try {
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

router.all('/plan/create', async (req, res) => {
  try {
    const createdPlan = await axios({
      url: 'https://api-m.sandbox.paypal.com/v1/billing/plans',
      method: 'post',
      headers: {
        'Content-Type': 'application/json'
      },
      auth: {
        username: mandatoryFilter('BASIC_AUTH_USERNAME'),
        password: mandatoryFilter('BASIC_AUTH_PASSWORD')
      },
      data: {
        product_id: 'PROD-6MS07618AN5499408',
        name: 'test',
        status: 'ACTIVE',
        billing_cycles: [
          
          {
            frequency: {
              interval_unit: 'MONTH',
              interval_count: 1
            },
            tenure_type: 'TRIAL',
            sequence: 1,
            total_cycles: 2,
            pricing_scheme: {
              fixed_price: {
                value: '10',
                currency_code: 'USD'
              }
            }
          },
          {
            frequency: {
              interval_unit: 'MONTH',
              interval_count: 1
            },
            tenure_type: 'REGULAR',
            sequence: 2,
            total_cycles: 0,
            pricing_scheme: {
              fixed_price: {
                value: '100',
                currency_code: 'USD'
              }
            }
          }
        ],
        payment_preferences: {
          auto_bill_outstanding: false
        },
        taxes: {
          percentage: 10,
          inclusive: false
        }
      }
    });

    console.log(createdPlan.data);
    res.status(200).json(createdPlan.data);
  } catch (err) {
    console.error(err);
  }
})

export default router;