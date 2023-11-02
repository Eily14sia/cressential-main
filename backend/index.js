// app.js or index.js

const express = require('express');
const cors = require('cors');
const fileRoutes = require('./fileroutes');
const mysqlRoutes = require('./server'); // Import the MySQL routes
const paymentapi = require('./payment');
const emailapi = require('./email');
const bodyParser = require('body-parser');
const path = require('path'); // Import the path module

const app = express();
const PORT = process.env.PORT || 8081;

// Middleware
const corsOptions = {
  origin: ['http://localhost:8081', 'https://cressential-5435c63fb5d8.herokuapp.com'],
};

app.use(cors(corsOptions));

//When you navigate to the root page, it would use the built react-app
app.use(express.static(path.resolve(__dirname, "../client/build")));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Routes
app.use('/files', fileRoutes); // File-related routes
app.use('/mysql', mysqlRoutes); // MySQL-related routes (adjust the prefix as needed)
app.use('/payments', paymentapi); //Payment API
app.use('/emails', emailapi); //Email API

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});





