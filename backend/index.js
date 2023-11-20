// app.js or index.js

const express = require('express');
const cors = require('cors');
const fileRoutes = require('./fileroutes');
const mysqlRoutes = require('./server'); // Import the MySQL routes
const paymentapi = require('./payment');
const emailapi = require('./email');
const adobeSign = require('./adobeSign');
const bodyParser = require('body-parser');
const path = require('path'); // Import the path module
const smartcon = require('./blockchain');

const app = express();
const PORT = process.env.PORT || 8081;

// Middleware
// Allow requests from your frontend applications, both on localhost and Heroku
const allowedOrigins = ['http://localhost:5173', 'http://localhost:8081', 'https://cressential-5435c63fb5d8.herokuapp.com'];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }
};

app.use(cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Routes
app.use('/files', fileRoutes); // File-related routes
app.use('/mysql', mysqlRoutes); // MySQL-related routes (adjust the prefix as needed)
app.use('/payments', paymentapi); //Payment API
app.use('/emails', emailapi); //Email API
app.use('/blockchain', smartcon); //Blockchain API
app.use('/adobeSign', adobeSign); //Adobe Sign API

// Serve the client build folder
app.use(express.static(path.resolve(__dirname, "../client/build")));

// This wildcard route should come last
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, "../client/build", "index.html"));
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});




