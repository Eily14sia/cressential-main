const express = require('express');
const router = express.Router();
const multer = require('multer');
const crypto = require('crypto');
const PDFParser = require('pdf-parse');
const multihashes = require('multihashes'); // Import the multihashes library
const upload = multer(); // No destination specified for multer
const ipfsClient = require('ipfs-http-client');
const fs = require('fs');
const pdfjsLib = require('pdfjs-dist');
require('dotenv').config();

// Use your Infura API key and API key secret here
const projectId = process.env.API_KEY;
const projectSecret = process.env.PROJECT_SECRET;

//infura config

const auth = 'Basic ' + Buffer.from(projectId+':'+projectSecret).toString('base64');
const client = ipfsClient({
    host: 'ipfs.infura.io',
    port: 5001,
    path: '/api/v0/add',
    protocol: 'https',
    headers: { authorization: auth,},
});

router.post('/api/maindec', upload.single('file'), async (req, res) => {
  const { file } = req;

  try {
    const pdfBuffer = file.buffer;
    let pdfData;

    try {
      pdfData = await PDFParser(pdfBuffer);
    } catch (error) {
      const result = await client.add(pdfBuffer);

      if (result && result.cid) {
        const uploadedFileCID = result.cid.toString();

        // Calculate the hash of the file using SHA-2-256
        const hash = crypto.createHash('sha256').update(pdfBuffer).digest();

        // Encode the hash using the multihash format
        const encodedMultihash = multihashes.encode(hash, 'sha2-256');

        // Convert the encoded multihash to a hexadecimal string
        const multihashHex = multihashes.toHexString(encodedMultihash);

        return res.json({
          message: 'File uploaded successfully to IPFS.',
          encrypted: true,
          cid: uploadedFileCID,
          multihash: `0x${multihashHex}`,
        });
      } else {
        return res.status(500).json({ error: 'Error uploading file to IPFS. No hash in the response.' });
      }
    }
    return res.json({ message: 'File is not encrypted and will not be uploaded to IPFS.', encrypted: false });
  } catch (error) {
    console.error('Error uploading file:', error);
    if (error.response) {
      // Log the actual response from IPFS
      console.error('IPFS Response:', error.response.data);
    }
    res.status(500).json({ error: 'Error uploading file.' });
  }
});

async function validatePasswordForPDF(pdfData, password) {
  try {
    const pdfDocument = await pdfjsLib.getDocument({
      data: pdfData,
      password,
    }).promise;

    console.log('Password matches the encrypted file');
    // Perform further actions or validation logic here upon successful decryption
    return true; // Return true to indicate password match
  } catch (error) {
    console.error('Incorrect password or decryption failed');
    // Handle incorrect password or decryption failure
    return false; // Return false to indicate password mismatch
  }
}

router.post('/api/validatePasswordForPDF', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      throw new Error('No file uploaded'); // Throw an error if no file is found
    }

    const { file } = req;
    const { password } = req.body;
    // Get the file buffer from multer
    const pdfBuffer = file.buffer;

    // Convert the file buffer to Uint8Array for pdfjs-dist
    const pdfData = new Uint8Array(pdfBuffer);

    // Validate password for the PDF
    const isPasswordValid = await validatePasswordForPDF(pdfData, password);

    // Send the validation result as the response
    res.json({ isPasswordValid });
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).json({ error: error.message }); // Send an error response
  }
});


module.exports = router;
