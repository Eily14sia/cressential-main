const express = require('express');
const router = express.Router();
const axios = require('axios');
const bodyParser = require('body-parser');
// Replace with your actual PayMongo API keys

// const PAYMONGO_SECRET_KEY = 'sk_test_MCKKhBcvwnY5aZdziTRiqGtf';

router.use(bodyParser.json());
// Define a route for initiating payments

let clientKey = '';

const setClientKeyMiddleware = (req, res, next) => {
  req.clientKey = clientKey;
  // req.clientKey = clientKey.split('_client')[0];
  next();
};

router.post('/paymongoIntent', async (req, res) => {
    const { amount } = req.body;
    try {
        const options = {
          method: 'POST',
          url: 'https://api.paymongo.com/v1/payment_intents',
          headers: {
            accept: 'application/json',
            'content-type': 'application/json',
            authorization: 'Basic c2tfdGVzdF9NQ0tLaEJjdnduWTVhWmR6aVRSaXFHdGY6',
          },
          data: {
            data: {
              attributes: {
                amount,
                payment_method_allowed: ['dob', 'paymaya', 'gcash'],
                currency: 'PHP',
                capture_type: 'automatic',
              },
            },
          },
        };
    
        const response = await axios.request(options);
        clientKey = response.data.data.id;
        console.log(response.data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }

});

router.post('/paymongoMethod', setClientKeyMiddleware, async (req, res) => {
  const { selectedOption } = req.body;
  const paymentURL = `https://api.paymongo.com/v1/payment_methods`;
  if (selectedOption === 'gcash') {
    try {
      const options = {
        method: 'POST',
        url: paymentURL,
        headers: {
          accept: 'application/json',
          'Content-Type': 'application/json',
          authorization: 'Basic c2tfdGVzdF9NQ0tLaEJjdnduWTVhWmR6aVRSaXFHdGY6'
        },
        data: {
          data: {
            attributes: {
              type: 'gcash',
            }
          },
        },
      };
      const response = await axios.request(options);
      console.log(response.data);
      const paymentmethodID = response.data.data.id;

      try{ 
        const options = {
          method: 'POST',
          url: `https://api.paymongo.com/v1/payment_intents/${req.clientKey}/attach`,
          headers: {
            accept: 'application/json',
            'content-type': 'application/json',
            authorization: 'Basic c2tfdGVzdF9NQ0tLaEJjdnduWTVhWmR6aVRSaXFHdGY6'
          },
          data: {
            data: {
              attributes: {
                payment_method: paymentmethodID, 
                client_key: req.clientKey,
                return_url: 'http://localhost:5173'
              }
            }
          }
          };

      const response = await axios.request(options);
      console.log(response.data);
      
      const paymentIntent = response.data.data;
      const paymentIntentStatus = paymentIntent.attributes.status;
  
      if (paymentIntentStatus === 'awaiting_next_action') {
        const { next_action } = response.data.data.attributes;

        if (next_action && next_action.type === 'redirect' && next_action.redirect) {
          const paymentMethodsURL = next_action.redirect.url;
           res.json({ redirectUrl: paymentMethodsURL });
          // Now, you can use `redirectUrl` in your frontend to perform the redirection.
        }
        // Render your modal for 3D Secure Authentication since next_action has a value. You can access the next action via paymentIntent.attributes.next_action.
      } else if (paymentIntentStatus === 'succeeded') {

        // You already received your customer's payment. You can show a success message from this condition.
      } else if(paymentIntentStatus === 'awaiting_payment_method') {
        // The PaymentIntent encountered a processing error. You can refer to paymentIntent.attributes.last_payment_error to check the error and render the appropriate error message.
      }  else if (paymentIntentStatus === 'processing'){
        // You need to requery the PaymentIntent after a second or two. This is a transitory status and should resolve to `succeeded` or `awaiting_payment_method` quickly.
      }

      }catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
        }
    
  } catch (error) {
  console.error(error);
  res.status(500).json({ error: 'Internal Server Error' });
  }
  } 
  else if (selectedOption === 'paymaya') {
    try {
      const options = {
        method: 'POST',
        url: paymentURL,
        headers: {
          accept: 'application/json',
          'Content-Type': 'application/json',
          authorization: 'Basic c2tfdGVzdF9NQ0tLaEJjdnduWTVhWmR6aVRSaXFHdGY6'
        },
        data: {
          data: {
            attributes: {
              type: 'paymaya',
            }
          },
        },
      };
     const response = await axios.request(options);
      console.log(response.data);
      const paymentmethodID = response.data.data.id;

      try{ 
        const options = {
          method: 'POST',
          url: `https://api.paymongo.com/v1/payment_intents/${req.clientKey}/attach`,
          headers: {
            accept: 'application/json',
            'content-type': 'application/json',
            authorization: 'Basic c2tfdGVzdF9NQ0tLaEJjdnduWTVhWmR6aVRSaXFHdGY6'
          },
          data: {
            data: {
              attributes: {
                payment_method: paymentmethodID, 
                client_key: req.clientKey,
                return_url: 'http://localhost:5173'
              }
            }
          }
          };

      const response = await axios.request(options);
      console.log(response.data);
      
      const paymentIntent = response.data.data;
      const paymentIntentStatus = paymentIntent.attributes.status;
  
      if (paymentIntentStatus === 'awaiting_next_action') {
        const { next_action } = response.data.data.attributes;

        if (next_action && next_action.type === 'redirect' && next_action.redirect) {
          const paymentMethodsURL = next_action.redirect.url;
           res.json({ redirectUrl: paymentMethodsURL });
          // Now, you can use `redirectUrl` in your frontend to perform the redirection.
        }
        // Render your modal for 3D Secure Authentication since next_action has a value. You can access the next action via paymentIntent.attributes.next_action.
      } else if (paymentIntentStatus === 'succeeded') {
        
        // You already received your customer's payment. You can show a success message from this condition.
      } else if(paymentIntentStatus === 'awaiting_payment_method') {
        // The PaymentIntent encountered a processing error. You can refer to paymentIntent.attributes.last_payment_error to check the error and render the appropriate error message.
      }  else if (paymentIntentStatus === 'processing'){
        // You need to requery the PaymentIntent after a second or two. This is a transitory status and should resolve to `succeeded` or `awaiting_payment_method` quickly.
      }

      }catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
        }
    
  } catch (error) {
  console.error(error);
  res.status(500).json({ error: 'Internal Server Error' });
  }
  } 

  else if (selectedOption === 'dob') {
    try {
      const options = {
        method: 'POST',
        url: paymentURL,
        headers: {
          accept: 'application/json',
          'Content-Type': 'application/json',
          authorization: 'Basic c2tfdGVzdF9NQ0tLaEJjdnduWTVhWmR6aVRSaXFHdGY6'
        },
        data: {
          data: {
            attributes: {
              type: 'dob',
              details: {
                "bank_code": "test_bank_one"
              }
            }
          },
        },
      };
      const response = await axios.request(options);
      console.log(response.data);
      const paymentmethodID = response.data.data.id;

      try{ 
        const options = {
          method: 'POST',
          url: `https://api.paymongo.com/v1/payment_intents/${req.clientKey}/attach`,
          headers: {
            accept: 'application/json',
            'content-type': 'application/json',
            authorization: 'Basic c2tfdGVzdF9NQ0tLaEJjdnduWTVhWmR6aVRSaXFHdGY6'
          },
          data: {
            data: {
              attributes: {
                payment_method: paymentmethodID, 
                client_key: req.clientKey,
                return_url: 'http://localhost:5173'
              }
            }
          }
          };

      const response = await axios.request(options);
      console.log(response.data);
      
      const paymentIntent = response.data.data;
      const paymentIntentStatus = paymentIntent.attributes.status;
  
      if (paymentIntentStatus === 'awaiting_next_action') {
        const { next_action } = response.data.data.attributes;

        if (next_action && next_action.type === 'redirect' && next_action.redirect) {
          const paymentMethodsURL = next_action.redirect.url;
           res.json({ redirectUrl: paymentMethodsURL });
          // Now, you can use `redirectUrl` in your frontend to perform the redirection.
        }
        // Render your modal for 3D Secure Authentication since next_action has a value. You can access the next action via paymentIntent.attributes.next_action.
      } else if (paymentIntentStatus === 'succeeded') {
        
        // You already received your customer's payment. You can show a success message from this condition.
      } else if(paymentIntentStatus === 'awaiting_payment_method') {
        // The PaymentIntent encountered a processing error. You can refer to paymentIntent.attributes.last_payment_error to check the error and render the appropriate error message.
      }  else if (paymentIntentStatus === 'processing'){
        // You need to requery the PaymentIntent after a second or two. This is a transitory status and should resolve to `succeeded` or `awaiting_payment_method` quickly.
      }

      }catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
        }
    
  } catch (error) {
  console.error(error);
  res.status(500).json({ error: 'Internal Server Error' });
  }
  } 
  
  else {
    // Handle other payment methods or invalid selections
    res.status(400).json({ error: 'Invalid or unsupported payment method' });
  }

});

module.exports = router;
