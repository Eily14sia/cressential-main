const express = require('express');
const router = express.Router();
const multer = require('multer');
const Qpdf = require('node-qpdf');
const fs = require('fs').promises;
const ipfsClient = require('ipfs-http-client');
const crypto = require('crypto');
const multihashes = require('multihashes'); // Import the multihashes library
const pdfjsLib = require('pdfjs-dist');
require('dotenv').config();

// Set up multer for handling file uploads
const upload = multer({ dest: 'uploads/' }); // Specify the upload directory

const projectId = process.env.API_KEY;
const projectSecret = process.env.PROJECT_SECRET;

// infura config
const auth = 'Basic ' + Buffer.from(projectId + ':' + projectSecret).toString('base64');
const client = ipfsClient({
    host: 'ipfs.infura.io',
    port: 5001,
    path: '/api/v0/add',
    protocol: 'https',
    headers: { authorization: auth, },
});

async function encryptPDF(filePath, password) {
    const options = {
        keyLength: 256,
        password: password
    };

    try {
      const encryptedData = await Qpdf.encrypt(filePath, options);
      if (encryptedData) {
          console.log('Password added successfully');
          return encryptedData;
      } else {
          throw new Error('Encryption failed');
      }
    } catch (error) {
        console.error('Error:', error);
        throw error; // Propagate the error
    }
}

async function uploadToIPFS(dataBuffer) {
    try {
        const result = await client.add(dataBuffer);
        return result.cid.toString();
    } catch (error) {
        console.error('Error uploading to IPFS:', error);
        throw error; // Propagate the error
    }
}

router.post('/api/maindec', upload.single('file'), async (req, res) => {
    const { file } = req;
    const { password } = req.body;

    // Input parameters
    const filePath = file.path;

    try {
        // Encrypt the file on disk using node-qpdf
        const encryptedPdfBuffer = await encryptPDF(filePath, password);

        // Upload the encrypted PDF to IPFS
        const uploadedFileCID = await uploadToIPFS(encryptedPdfBuffer);

         // Calculate the hash of the CID using SHA-2-256
         const hash = crypto.createHash('sha256').update(uploadedFileCID).digest();

         // Encode the hash using the multihash format
         const encodedMultihash = multihashes.encode(hash, 'sha2-256');
 
         // Convert the encoded multihash to a hexadecimal string
         const multihashHex = multihashes.toHexString(encodedMultihash);
 
         // Delete the uploaded file from the local directory
         await fs.unlink(filePath);

        res.json({
            message: 'File encrypted, uploaded to IPFS, and local file deleted successfully.',
            ipfsCID: uploadedFileCID,
            multihash: `0x${multihashHex}`
        });
    } catch (error) {
        console.error('Error handling file:', error);
        res.status(500).json({ error: 'Error handling file.' });
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
