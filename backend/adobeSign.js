const express = require('express');
const axios = require('axios');
const router = express.Router();
const querystring = require('querystring'); // Import querystring module
const multer = require('multer'); // Import multer for handling file uploads
const FormData = require('form-data');
require('dotenv').config();

const storage = multer.memoryStorage(); // Store the file in memory
const upload = multer({ storage: storage });


router.post('/getAccessToken', async (req, res) => {
    // Get the value of 'access_code' from the FormData
    const authorizationCode = req.body.access_code;

  try {
    const {
      grantType = 'authorization_code',
      clientId = 'CBJCHBCAABAARe7cQZ-s5GKs3x1hejZiDftJTu7qZjxm',
      clientSecret = process.env.CLIENT_SECRET,
      redirectUri = 'https://cressential-5435c63fb5d8.herokuapp.com/signature-request',
      code = authorizationCode,
    } = req.body;

    // Check if required parameters are present
    if (!clientId || !clientSecret || !redirectUri || !grantType) {
      console.error('Missing required parameters (clientId, clientSecret, redirectUri, grantType)');
      return res.status(400).json({
        error: 'Missing required parameters (clientId, clientSecret, redirectUri, grantType)'
      });
    }

    const adobeSignOAuthUrl = 'https://api.sg1.adobesign.com/oauth/v2/token';

    // Encode the data in x-www-form-urlencoded format
    const requestData = querystring.stringify({
      grant_type: grantType,
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: redirectUri,
      code: code,
    });

    // Set headers
    const headers = {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Cache-Control': 'no-cache',
    };

    console.log('Request Data:', requestData);

    const response = await axios.post(adobeSignOAuthUrl, requestData, {
      headers: headers,
    });

    console.log('Response Data:', response.data);

    const accessToken = response.data.access_token;
    const expiresIn = response.data.expires_in;

    console.log('Access Token:', accessToken);
    console.log('Expires In:', expiresIn);

    res.json({
      accessToken: accessToken,
      expiresIn: expiresIn,
    });

  } catch (error) {
    console.error('Error obtaining access token:', error.response ? error.response.data : error.message);
    res.status(error.response ? error.response.status : 500).json({
      error: 'Error obtaining access token',
    });
  }
});


router.post('/upload', upload.single('File'), async (req, res) => {
    try {
      
        // Access the 'access_token' from the form data
        const accessToken = req.body.access_token;

        console.log('body access token', accessToken);
        
        if (!accessToken) {
          return res.status(400).json({ error: 'Access token not provided' });
        }
    
        const transientDocumentsApiUrl = 'https://api.sg1.adobesign.com/api/rest/v6/transientDocuments';
        const agreementsApiUrl = 'https://api.sg1.adobesign.com/api/rest/v6/agreements';
    
        const form = new FormData();
    
        // Append the file to the form data
        form.append('File', req.file.buffer, {
          filename: req.file.originalname,
          contentType: req.file.mimetype,
        });
    
        // Perform the request to upload the file as a transient document
        const transientDocumentResponse = await axios.post(transientDocumentsApiUrl, form, {
          headers: {
            ...form.getHeaders(),
            Authorization: `Bearer ${accessToken}`,
          },
        });
    
        // Obtain the transient document ID from the response
        const transientDocumentId = transientDocumentResponse.data.transientDocumentId;
    
        console.log('Transient Document ID:', transientDocumentId);
   
        // Now, you can proceed to create an agreement using the transient document ID
    const agreementResponse = await axios.post(agreementsApiUrl, {
        fileInfos: [
          {
            transientDocumentId: transientDocumentId,
          },
        ],
        name: 'Sample Agreement',
        participantSetsInfo: [
          {
            memberInfos: [
              {
                email: 'dhargrefiel@gmail.com',
              },
            ],
            order: 1,
            role: 'SIGNER',
          },
        ],
        signatureType: 'ESIGN',
        state: 'IN_PROCESS',
        signatureFlow: 'SENDER_SIGNATURE_NOT_REQUIRED',
      }, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
  
      console.log('Agreement Creation Response:', agreementResponse.data);
  
      res.json({
        transientDocumentId: transientDocumentId,
        agreementId: agreementResponse.data.id,
      });

      } catch (error) {
        console.error('Error uploading file to transient documents:', error.message);
        res.status(error.response ? error.response.status : 500).json({ error: 'Error uploading file to transient documents' });
      }
    
  });

  router.get('/getAgreementStatus', async (req, res) => {
    try {
      const { accessToken } = req.query;
      const { agreementId } = req.query;
  
      if (!accessToken || !agreementId) {
        return res.status(400).json({ error: 'Access token or agreement ID not provided' });
      }
  
      const agreementApiUrl = `https://api.sg1.adobesign.com/api/rest/v6/agreements/${agreementId}`;
  
      const response = await axios.get(agreementApiUrl, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
  
      console.log('Agreement Status Response:', response.data);
  
      res.json({
        agreementId: agreementId,
        status: response.data.status,
      });
    } catch (error) {
      console.error('Error getting agreement status:', error.message);
      res.status(error.response ? error.response.status : 500).json({ error: 'Error getting agreement status' });
    }
  });

module.exports = router;
