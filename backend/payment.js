const express = require('express');
const router = express.Router();
const axios = require('axios');
const bodyParser = require('body-parser');
require('dotenv').config();
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
            authorization: process.env.AUTHORIZATION,
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

  const { selectedOption, totalAmount, ctrl_number, jwtToken, landing_page, user_email } = req.body;
  
  const today = new Date();
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  const formattedDate = today.toLocaleDateString('en-US', options);

  const sendSuccessEmail = async (toEmail, ctrlNumber, paymentID, amountPaid, dateToday, paymentMethod) => {

    const emailData = {
      to: toEmail,
      subject: 'Successful Payment Confirmation',
      text: `
      Good day!
  
        • Payment Receipt
        • Control Number: Ctrl-${ctrlNumber}
        • Payment ID: ${paymentID}
        • Date: ${dateToday}
        • Payment method: ${paymentMethod}
        • Amount Paid: ${amountPaid}

      Payment Confirmation:
      We're delighted to inform you that your payment for the record request has been successfully received and processed.

      Thank you.

      Sincerely,
      Registrar's Office
      `,
    };

    try {
      const response = await axios.post('https://cressential-5435c63fb5d8.herokuapp.com/emails/send-email', emailData);
      if (response.status === 200) {
        console.log('Email sent successfully.');
      } else {
        console.error('Failed to send email.');
      }
    } catch (error) {
      console.error('Error sending email:', error);
    }

  };

  const sendFailedEmail = async (toEmail, ctrlNumber, amountPaid, dateToday, paymentMethod) => {

    const emailData = {
      to: toEmail,
      subject: 'Payment Failure Notice',
      text: `
      Good day!
  
        • Payment Receipt
        • Control Number: Ctrl-${ctrlNumber}
        • Date: ${dateToday}
        • Payment method: ${paymentMethod}
        • Amount to be paid: ${amountPaid}
    
      Payment Failure Notice:
      We regret to inform you that your payment for the record request has failed or was cancelled.

      To complete the payment and reinstate your request, please follow these steps:
      1. Log in to our system: https://cressential-5435c63fb5d8.herokuapp.com
      2. Navigate to the "Record Request Table" or "Signature Request Table" section, depending on the type of your request.      3. Select your record request and click the "Pay now" Button.
      4. Proceed with the payment process.
    
      If you have any queries or need further assistance, please feel free to contact our office.
    
      Thank you.

      Sincerely,
      Registrar's Office
      `,
    };

    try {
      const response = await axios.post('https://cressential-5435c63fb5d8.herokuapp.com/emails/send-email', emailData);
      if (response.status === 200) {
        console.log('Email sent successfully.');
      } else {
        console.error('Failed to send email.');
      }
    } catch (error) {
      console.error('Error sending email:', error);
    }

  };


  const paymentURL = `https://api.paymongo.com/v1/payment_methods`;
  if (selectedOption === 'gcash') {
    try {
      const options = {
        method: 'POST',
        url: paymentURL,
        headers: {
          accept: 'application/json',
          'Content-Type': 'application/json',
          authorization: process.env.AUTHORIZATION
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
            authorization: process.env.AUTHORIZATION
          },
          data: {
            data: {
              attributes: {
                payment_method: paymentmethodID, 
                client_key: req.clientKey,
                return_url: landing_page
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

            // Define a function to periodically check the Payment Intent status
           async function checkPaymentStatus(paymentIntentID) {
            try {
              const checkStatusOptions = {
                method: 'GET',
                url: `https://api.paymongo.com/v1/payment_intents/${req.clientKey}`,
                headers: {
                  accept: 'application/json',
                  authorization: process.env.AUTHORIZATION
                },
              };
              const response = await axios.request(checkStatusOptions);
              console.log(response.data);
          
              const paymentIntent = response.data.data;
              const paymentIntentStatus = paymentIntent.attributes.status;
              
              if (paymentIntentStatus === 'succeeded') {
                // The payment has been successfully authorized
                // You can perform any necessary actions here
                const paymentID = response.data.data.attributes.payments[0].id;

                const updatedRecord = {
                  payment_method: selectedOption,
                  total_amount: totalAmount,
                  payment_id: paymentID,  
                };

                const apiUrl = `https://cressential-5435c63fb5d8.herokuapp.com/mysql/update-payment/${ctrl_number}`;
                try {
                  const response = await axios.put(apiUrl, updatedRecord, {
                    headers: {
                      'Content-Type': 'application/json',
                      Authorization: `Bearer ${jwtToken}`,
                    },
                  });
                
                  if (response.status === 200) {
                    console.log('Successfully updated the payment:', response.data);

                    sendSuccessEmail(user_email, ctrl_number, paymentID, totalAmount, formattedDate, selectedOption);
                  } else {
                    console.error('Error:', response.statusText);
                    // sendFailedEmail(user_email, ctrl_number, totalAmount, formattedDate, selectedOption);
                  }
                } catch (error) {
                  console.error('An error occurred:', error);
                  // sendFailedEmail(user_email, ctrl_number, totalAmount, formattedDate);
                }

                console.log('Payment has succeeded!');
              } else if (paymentIntentStatus === 'canceled') {

                sendFailedEmail(user_email, ctrl_number, totalAmount, formattedDate, selectedOption);
                console.log('Payment has been canceled.');
              } else if (paymentIntentStatus === 'failed') {
                
                sendFailedEmail(user_email, ctrl_number, totalAmount, formattedDate, selectedOption);
                console.log('Payment has failed.');
              } else {
                // The payment is still in progress, you can set up a timer to poll again
                console.log('Payment is still in progress.');
                setTimeout(() => checkPaymentStatus(paymentIntentID), 10000); // Poll every 10 seconds
              }
            } catch (error) {
              console.error(error);
            }
          }
  
          // Start checking the Payment Intent status after redirection
          checkPaymentStatus(req.clientKey);
            
          }
          // Render your modal for 3D Secure Authentication since next_action has a value. You can access the next action via paymentIntent.attributes.next_action.
        } 

      } catch (error) {
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
          authorization: process.env.AUTHORIZATION
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
            authorization: process.env.AUTHORIZATION
          },
          data: {
            data: {
              attributes: {
                payment_method: paymentmethodID, 
                client_key: req.clientKey,
                return_url: landing_page
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

            // Define a function to periodically check the Payment Intent status
           async function checkPaymentStatus(paymentIntentID) {
              try {
                const checkStatusOptions = {
                  method: 'GET',
                  url: `https://api.paymongo.com/v1/payment_intents/${req.clientKey}`,
                  headers: {
                    accept: 'application/json',
                    authorization: process.env.AUTHORIZATION
                  },
                };
                const response = await axios.request(checkStatusOptions);
                console.log(response.data);
            
                const paymentIntent = response.data.data;
                const paymentIntentStatus = paymentIntent.attributes.status;
                

                if (paymentIntentStatus === 'succeeded') {
                  // The payment has been successfully authorized
                  // You can perform any necessary actions here
                  const paymentID = paymentIntent.attributes.payments[0].id;
                  
                  const updatedRecord = {
                    payment_method: selectedOption,
                    total_amount: totalAmount,
                    payment_id: paymentID,  
                  };

                  const apiUrl = `https://cressential-5435c63fb5d8.herokuapp.com/mysql/update-payment/${ctrl_number}`;
                  try {
                    const response = await axios.put(apiUrl, updatedRecord, {
                      headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${jwtToken}`,
                      },
                    });
                  
                    if (response.status === 200) {
                      console.log('Successfully updated the payment:', response.data);
                      
                      sendSuccessEmail(user_email, ctrl_number, paymentID, totalAmount, formattedDate, selectedOption);
                    } else {
                      console.error('Error:', response.statusText);
                      // Handle error here
                    }
                  } catch (error) {
                    console.error('An error occurred:', error);
                    // Handle the error
                  }

                  console.log('Payment has succeeded!');
                } else if (paymentIntentStatus === 'canceled') {
                  // The payment was canceled

                  sendFailedEmail(user_email, ctrl_number, totalAmount, formattedDate, selectedOption);
                  console.log('Payment has been canceled.');
                } else if (paymentIntentStatus === 'failed') {
                  // The payment has failed

                  sendFailedEmail(user_email, ctrl_number, totalAmount, formattedDate, selectedOption);
                  console.log('Payment has failed.');
                } else {
                  // The payment is still in progress, you can set up a timer to poll again
                  console.log('Payment is still in progress.');
                  setTimeout(() => checkPaymentStatus(paymentIntentID), 10000); // Poll every 10 seconds
                }
              } catch (error) {
                console.error(error);
              }
            }
  
          // Start checking the Payment Intent status after redirection
          checkPaymentStatus(req.clientKey);
            
          }
          // Render your modal for 3D Secure Authentication since next_action has a value. You can access the next action via paymentIntent.attributes.next_action.
        } 

      } catch (error) {
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
          authorization: process.env.AUTHORIZATION
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
            authorization: process.env.AUTHORIZATION
          },
          data: {
            data: {
              attributes: {
                payment_method: paymentmethodID, 
                client_key: req.clientKey,
                return_url: landing_page
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

            // Define a function to periodically check the Payment Intent status
           async function checkPaymentStatus(paymentIntentID) {
            try {
              const checkStatusOptions = {
                method: 'GET',
                url: `https://api.paymongo.com/v1/payment_intents/${req.clientKey}`,
                headers: {
                  accept: 'application/json',
                  authorization: process.env.AUTHORIZATION
                },
              };
              const response = await axios.request(checkStatusOptions);
              console.log(response.data);
          
              const paymentIntent = response.data.data;
              const paymentIntentStatus = paymentIntent.attributes.status;
              

              if (paymentIntentStatus === 'succeeded') {
                // The payment has been successfully authorized
                // You can perform any necessary actions here
                const paymentID = paymentIntent.attributes.payments[0].id;
                
                const updatedRecord = {
                  payment_method: selectedOption,
                  total_amount: totalAmount,
                  payment_id: paymentID,  
                };

                const apiUrl = `https://cressential-5435c63fb5d8.herokuapp.com/mysql/update-payment/${ctrl_number}`;
                try {
                  const response = await axios.put(apiUrl, updatedRecord, {
                    headers: {
                      'Content-Type': 'application/json',
                      Authorization: `Bearer ${jwtToken}`,
                    },
                  });
                
                  if (response.status === 200) {
                    console.log('Successfully updated the payment:', response.data);

                    sendSuccessEmail(user_email, ctrl_number, paymentID, totalAmount, formattedDate, selectedOption);
                  } else {
                    console.error('Error:', response.statusText);
                    // Handle error here
                  }
                } catch (error) {
                  console.error('An error occurred:', error);
                  // Handle the error
                }

                console.log('Payment has succeeded!');
              } else if (paymentIntentStatus === 'canceled') {
                // The payment was canceled

                sendFailedEmail(user_email, ctrl_number, totalAmount, formattedDate, selectedOption);
                console.log('Payment has been canceled.');
              } else if (paymentIntentStatus === 'failed') {
                // The payment has failed

                sendFailedEmail(user_email, ctrl_number, totalAmount, formattedDate, selectedOption);
                console.log('Payment has failed.');
              } else {
                // The payment is still in progress, you can set up a timer to poll again
                console.log('Payment is still in progress.');
                setTimeout(() => checkPaymentStatus(paymentIntentID), 10000); // Poll every 10 seconds
              }
            } catch (error) {
              console.error(error);
            }
          }
  
          // Start checking the Payment Intent status after redirection
          checkPaymentStatus(req.clientKey);
            
          }
          // Render your modal for 3D Secure Authentication since next_action has a value. You can access the next action via paymentIntent.attributes.next_action.
        } 

      } catch (error) {
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

router.post('/signature/paymongoMethod', setClientKeyMiddleware, async (req, res) => {

  const { selectedOption, totalAmount, ctrl_number, jwtToken, landing_page, user_email } = req.body;
  
  const today = new Date();
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  const formattedDate = today.toLocaleDateString('en-US', options);

  const sendSuccessEmail = async (toEmail, ctrlNumber, paymentID, amountPaid, dateToday, paymentMethod) => {

    const emailData = {
      to: toEmail,
      subject: 'Successful Payment Confirmation',
      text: `
      Good day!
  
        • Payment Receipt
        • Control Number: Ctrl-${ctrlNumber}
        • Payment ID: ${paymentID}
        • Date: ${dateToday}
        • Payment method: ${paymentMethod}
        • Amount Paid: ${amountPaid}

      Payment Confirmation:
      We're delighted to inform you that your payment for the record request has been successfully received and processed.

      Thank you.

      Sincerely,
      Registrar's Office
      `,
    };

    try {
      const response = await axios.post('https://cressential-5435c63fb5d8.herokuapp.com/emails/send-email', emailData);
      if (response.status === 200) {
        console.log('Email sent successfully.');
      } else {
        console.error('Failed to send email.');
      }
    } catch (error) {
      console.error('Error sending email:', error);
    }

  };

  const sendFailedEmail = async (toEmail, ctrlNumber, amountPaid, dateToday, paymentMethod) => {

    const emailData = {
      to: toEmail,
      subject: 'Payment Failure Notice',
      text: `
      Good day!
  
        • Payment Receipt
        • Control Number: Ctrl-${ctrlNumber}
        • Date: ${dateToday}
        • Payment method: ${paymentMethod}
        • Amount to be paid: ${amountPaid}
    
      Payment Failure Notice:
      We regret to inform you that your payment for the record request has failed or was cancelled.

      To complete the payment and reinstate your request, please follow these steps:
      1. Log in to our system: https://cressential-5435c63fb5d8.herokuapp.com
      2. Navigate to the "Record Request Table" or "Signature Request Table" section, depending on the type of your request.      3. Select your record request and click the "Pay now" Button.
      4. Proceed with the payment process.
    
      If you have any queries or need further assistance, please feel free to contact our office.
    
      Thank you.

      Sincerely,
      Registrar's Office
      `,
    };

    try {
      const response = await axios.post('https://cressential-5435c63fb5d8.herokuapp.com/emails/send-email', emailData);
      if (response.status === 200) {
        console.log('Email sent successfully.');
      } else {
        console.error('Failed to send email.');
      }
    } catch (error) {
      console.error('Error sending email:', error);
    }

  };

  const paymentURL = `https://api.paymongo.com/v1/payment_methods`;
  if (selectedOption === 'gcash') {
    try {
      const options = {
        method: 'POST',
        url: paymentURL,
        headers: {
          accept: 'application/json',
          'Content-Type': 'application/json',
          authorization: process.env.AUTHORIZATION
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
            authorization: process.env.AUTHORIZATION
          },
          data: {
            data: {
              attributes: {
                payment_method: paymentmethodID, 
                client_key: req.clientKey,
                return_url: landing_page
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

            // Define a function to periodically check the Payment Intent status
           async function checkPaymentStatus(paymentIntentID) {
            try {
              const checkStatusOptions = {
                method: 'GET',
                url: `https://api.paymongo.com/v1/payment_intents/${req.clientKey}`,
                headers: {
                  accept: 'application/json',
                  authorization: process.env.AUTHORIZATION
                },
              };
              const response = await axios.request(checkStatusOptions);
              console.log(response.data);
          
              const paymentIntent = response.data.data;
              const paymentIntentStatus = paymentIntent.attributes.status;
              
              if (paymentIntentStatus === 'succeeded') {
                // The payment has been successfully authorized
                // You can perform any necessary actions here
                const paymentID = response.data.data.attributes.payments[0].id;

                const updatedRecord = {
                  payment_method: selectedOption,
                  total_amount: totalAmount,
                  payment_id: paymentID,  
                };

                const apiUrl = `https://cressential-5435c63fb5d8.herokuapp.com/mysql/signature/update-payment/${ctrl_number}`;
                try {
                  const response = await axios.put(apiUrl, updatedRecord, {
                    headers: {
                      'Content-Type': 'application/json',
                      Authorization: `Bearer ${jwtToken}`,
                    },
                  });
                
                  if (response.status === 200) {
                    console.log('Successfully updated the payment:', response.data);
                    
                    sendSuccessEmail(user_email, ctrl_number, paymentID, totalAmount, formattedDate, selectedOption);
                  } else {
                    console.error('Error:', response.statusText);
                    // Handle error here
                  }
                } catch (error) {
                  console.error('An error occurred:', error);
                  // Handle the error
                }

                console.log('Payment has succeeded!');
              } else if (paymentIntentStatus === 'canceled') {
                // The payment was canceled

                sendFailedEmail(user_email, ctrl_number, totalAmount, formattedDate, selectedOption);
                console.log('Payment has been canceled.');
              } else if (paymentIntentStatus === 'failed') {
                // The payment has failed

                sendFailedEmail(user_email, ctrl_number, totalAmount, formattedDate, selectedOption);
                console.log('Payment has failed.');
              } else {
                // The payment is still in progress, you can set up a timer to poll again
                console.log('Payment is still in progress.');
                setTimeout(() => checkPaymentStatus(paymentIntentID), 10000); // Poll every 10 seconds
              }
            } catch (error) {
              console.error(error);
            }
          }
  
          // Start checking the Payment Intent status after redirection
          checkPaymentStatus(req.clientKey);
            
          }
          // Render your modal for 3D Secure Authentication since next_action has a value. You can access the next action via paymentIntent.attributes.next_action.
        } 

      } catch (error) {
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
          authorization: process.env.AUTHORIZATION
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
            authorization: process.env.AUTHORIZATION
          },
          data: {
            data: {
              attributes: {
                payment_method: paymentmethodID, 
                client_key: req.clientKey,
                return_url: landing_page
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

            // Define a function to periodically check the Payment Intent status
           async function checkPaymentStatus(paymentIntentID) {
              try {
                const checkStatusOptions = {
                  method: 'GET',
                  url: `https://api.paymongo.com/v1/payment_intents/${req.clientKey}`,
                  headers: {
                    accept: 'application/json',
                    authorization: process.env.AUTHORIZATION
                  },
                };
                const response = await axios.request(checkStatusOptions);
                console.log(response.data);
            
                const paymentIntent = response.data.data;
                const paymentIntentStatus = paymentIntent.attributes.status;
                

                if (paymentIntentStatus === 'succeeded') {
                  // The payment has been successfully authorized
                  // You can perform any necessary actions here
                  const paymentID = paymentIntent.attributes.payments[0].id;
                  
                  const updatedRecord = {
                    payment_method: selectedOption,
                    total_amount: totalAmount,
                    payment_id: paymentID,  
                  };

                  const apiUrl = `https://cressential-5435c63fb5d8.herokuapp.com/mysql/signature/update-payment/${ctrl_number}`;
                  try {
                    const response = await axios.put(apiUrl, updatedRecord, {
                      headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${jwtToken}`,
                      },
                    });
                  
                    if (response.status === 200) {
                      console.log('Successfully updated the payment:', response.data);
                      
                      sendSuccessEmail(user_email, ctrl_number, paymentID, totalAmount, formattedDate, selectedOption);
                    } else {
                      console.error('Error:', response.statusText);
                      // Handle error here
                    }
                  } catch (error) {
                    console.error('An error occurred:', error);
                    // Handle the error
                  }

                  console.log('Payment has succeeded!');
                } else if (paymentIntentStatus === 'canceled') {
                  // The payment was canceled

                  sendFailedEmail(user_email, ctrl_number, totalAmount, formattedDate, selectedOption);
                  console.log('Payment has been canceled.');
                } else if (paymentIntentStatus === 'failed') {
                  // The payment has failed

                  sendFailedEmail(user_email, ctrl_number, totalAmount, formattedDate, selectedOption);
                  console.log('Payment has failed.');
                } else {
                  // The payment is still in progress, you can set up a timer to poll again
                  console.log('Payment is still in progress.');
                  setTimeout(() => checkPaymentStatus(paymentIntentID), 10000); // Poll every 10 seconds
                }
              } catch (error) {
                console.error(error);
              }
            }
  
          // Start checking the Payment Intent status after redirection
          checkPaymentStatus(req.clientKey);
            
          }
          // Render your modal for 3D Secure Authentication since next_action has a value. You can access the next action via paymentIntent.attributes.next_action.
        } 

      } catch (error) {
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
          authorization: process.env.AUTHORIZATION
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
            authorization: process.env.AUTHORIZATION
          },
          data: {
            data: {
              attributes: {
                payment_method: paymentmethodID, 
                client_key: req.clientKey,
                return_url: landing_page
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

            // Define a function to periodically check the Payment Intent status
           async function checkPaymentStatus(paymentIntentID) {
            try {
              const checkStatusOptions = {
                method: 'GET',
                url: `https://api.paymongo.com/v1/payment_intents/${req.clientKey}`,
                headers: {
                  accept: 'application/json',
                  authorization: process.env.AUTHORIZATION
                },
              };
              const response = await axios.request(checkStatusOptions);
              console.log(response.data);
          
              const paymentIntent = response.data.data;
              const paymentIntentStatus = paymentIntent.attributes.status;
              

              if (paymentIntentStatus === 'succeeded') {
                // The payment has been successfully authorized
                // You can perform any necessary actions here
                const paymentID = paymentIntent.attributes.payments[0].id;
                
                const updatedRecord = {
                  payment_method: selectedOption,
                  total_amount: totalAmount,
                  payment_id: paymentID,  
                };

                const apiUrl = `https://cressential-5435c63fb5d8.herokuapp.com/mysql/signature/update-payment/${ctrl_number}`;
                try {
                  const response = await axios.put(apiUrl, updatedRecord, {
                    headers: {
                      'Content-Type': 'application/json',
                      Authorization: `Bearer ${jwtToken}`,
                    },
                  });
                
                  if (response.status === 200) {
                    console.log('Successfully updated the payment:', response.data);
                    
                    sendSuccessEmail(user_email, ctrl_number, paymentID, totalAmount, formattedDate, selectedOption);
                  } else {
                    console.error('Error:', response.statusText);
                    // Handle error here
                  }
                } catch (error) {
                  console.error('An error occurred:', error);
                  // Handle the error
                }

                console.log('Payment has succeeded!');
              } else if (paymentIntentStatus === 'canceled') {
                // The payment was canceled

                sendFailedEmail(user_email, ctrl_number, totalAmount, formattedDate, selectedOption);
                console.log('Payment has been canceled.');
              } else if (paymentIntentStatus === 'failed') {
                // The payment has failed

                sendFailedEmail(user_email, ctrl_number, totalAmount, formattedDate, selectedOption);
                console.log('Payment has failed.');
              } else {
                // The payment is still in progress, you can set up a timer to poll again
                console.log('Payment is still in progress.');
                setTimeout(() => checkPaymentStatus(paymentIntentID), 10000); // Poll every 10 seconds
              }
            } catch (error) {
              console.error(error);
            }
          }
  
          // Start checking the Payment Intent status after redirection
          checkPaymentStatus(req.clientKey);
            
          }
          // Render your modal for 3D Secure Authentication since next_action has a value. You can access the next action via paymentIntent.attributes.next_action.
        } 

      } catch (error) {
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
