const express = require('express');
const router = express.Router();
const multer = require('multer');
const PDFParser = require('pdf-parse');
const ipfsAPI = require('ipfs-api'); // Import the ipfs-api library

const upload = multer(); // No destination specified for multer
const ipfs = ipfsAPI({ host: '127.0.0.1', port: '5001', protocol: 'http' }); // Initialize IPFS instance

router.post('/api/maindec', upload.single('file'), async (req, res) => {
  const { file } = req;

  try {
    const pdfBuffer = file.buffer;
    let pdfData;

    try {
      pdfData = await PDFParser(pdfBuffer);
    } catch (error) {
      const result = await ipfs.add({ content: pdfBuffer });
      if (result && result[0] && result[0].hash) {
        const uploadedFileCID = result[0].hash;
        return res.json({ message: 'File uploaded successfully to IPFS.', encrypted: true, cid: uploadedFileCID });
      } else {
        return res.status(500).json({ error: 'Error uploading file to IPFS.' });
      }
    }

    return res.json({ message: 'File is not encrypted and will not be uploaded to IPFS.', encrypted: false });
  } catch (error) {
    console.error('Error uploading file:', error);
    res.status(500).json({ error: 'Error uploading file.' });
  }
});


module.exports = router;