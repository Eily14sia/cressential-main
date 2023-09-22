// app.js or index.js

const express = require('express');
const cors = require('cors');
const fileRoutes = require('./fileroutes');
const mysqlRoutes = require('./server'); // Import the MySQL routes
const paymentapi = require('./payment');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 8081;

// Middleware
app.use(cors({
  origin: 'http://localhost:5173' // Replace with your React frontend URL
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Routes
app.use('/files', fileRoutes); // File-related routes
app.use('/mysql', mysqlRoutes); // MySQL-related routes (adjust the prefix as needed)
app.use('/payments', paymentapi); //Payment API

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});





