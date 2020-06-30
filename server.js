const express = require('express');
const dotenv = require('dotenv');

// Route files
const bootcamps = require('./routes/bootcamps');

// Load env vars
dotenv.config({ path: './config/config.env' });

// Initialize express app
const app = express();

// Mount Routes
app.use('/api/v1/bootcamps', bootcamps);

const PORT = process.env.PORT || 5000;

// Express App Listening
app.listen(PORT, () =>
  console.log(`Server started in ${process.env.NODE_ENV} mode on port ${PORT}`)
);
