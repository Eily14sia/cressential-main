const express = require('express');
const axios = require('axios');
const web3 = require('web3'); // Make sure to install web3.js using npm install web3

const router = express.Router();

const infuraUrl = 'https://sepolia.infura.io/v3/95f8c5884e5c4949a30374a6442d04ae'; // Replace with your Infura project ID

router.post('/getTransaction', async (req, res) => {
    const { txHash } = req.body; // Use req.body to get data from the request body
  
    const requestBody = {
      jsonrpc: '2.0',
      method: 'eth_getTransactionByHash',
      params: [txHash],
      id: 1,
    };
  
    try {
      const response = await axios.post(infuraUrl, requestBody, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
  // Check if the response is successful
  if (response.data && response.data.result !== null) {
    const transactionDetails = response.data.result;
    const inputData = transactionDetails.input;
    console.log('Transaction Input Data:', inputData);

            const dataPart = inputData.slice(10);

        // Decode the remaining data as a string
        const decodedString = web3.utils.hexToUtf8(dataPart);

        console.log("Decoded String: ", decodedString);
        // Extract the desired part using a regular expression
        const extractedPart = decodedString.match(/0x[0-9a-fA-F]+/);

        if (extractedPart) {
        console.log("Extracted Part: ", extractedPart[0]);
        } else {
        console.log("No valid part found.");
        }

    res.json({ success: true, transactionDetails });
  } else if (response.data && response.data.error) {
    console.error('Error:', response.data.error.message); // Log the error message
    res.status(400).json({ success: false, error: response.data.error.message });
  } else {
    console.error('Unexpected response:', response.data);
    res.status(500).json({ success: false, error: 'Unexpected response from Infura' });
  }
} catch (error) {
  console.error('Error:', error.message); // Log the error
  console.error('Response from Infura:', error.response ? error.response.data : 'N/A'); // Log the full response from Infura if available
  res.status(500).json({ success: false, error: 'Internal server error' });
}
  });
  

module.exports = router;
