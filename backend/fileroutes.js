const express = require('express');
const router = express.Router();
const multer = require('multer');
const crypto = require('crypto');
const PDFParser = require('pdf-parse');
const multihashes = require('multihashes'); // Import the multihashes library
const upload = multer(); // No destination specified for multer
const ipfsClient = require('ipfs-http-client');
require('dotenv').config();

// Use your Infura API key and API key secret here
const projectId = process.env.PROJECT_ID;
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
  } catch (error) {
    console.error('Error uploading file:', error);
    if (error.response) {
      // Log the actual response from IPFS
      console.error('IPFS Response:', error.response.data);
    }
    res.status(500).json({ error: 'Error uploading file.' });
  }
});

module.exports = router;
