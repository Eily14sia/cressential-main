const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
require('dotenv').config();

// Middleware
router.use(bodyParser.json());

// Configure Nodemailer
const transporter = nodemailer.createTransport({
  service: 'Gmail', // e.g., 'Gmail' for Gmail
  auth: {
    user: process.env.EMAIL, // your email address
    pass: process.env.APP_PASSWORD,    // your email password or app password
  },
  secure: true,
  tls: {
    rejectUnauthorized: false,
}, // Do not reject self-signed certificates
});

// Define a POST route to send an email
router.post('/send-email', (req, res) => {
  const { to, subject, text } = req.body;

  const mailOptions = {
    from: process.env.EMAIL, // sender's email address
    to,                             // recipient's email address
    subject,                        // email subject
    text,                           // email body
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending email:', error);
      res.status(500).json({ error: 'Failed to send email' });
    } else {
      console.log('Email sent:', info.response);
      res.status(200).json({ message: 'Email sent successfully' });
    }
  });
});

module.exports = router;