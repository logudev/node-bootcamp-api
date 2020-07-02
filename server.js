const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const colors = require('colors');
const connectDB = require('./config/db');

// const logger = require('./middleware/logger');

// Route files
const bootcampRoute = require('./routes/bootcamps');

// Load env vars
dotenv.config({ path: './config/config.env' });

// Connect to MongoDB
connectDB();

// Initialize express app
const app = express();

// Body Parser Middleware
app.use(express.json());

// Using logger middleware
// app.use(logger);

// Using morgan as logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Mount Routes
app.use('/api/v1/bootcamps', bootcampRoute);

const PORT = process.env.PORT || 5000;

// Express App Listening
const server = app.listen(PORT, () =>
  console.log(
    `Server started in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold
  )
);

// Handle unhandled promise rejection warnings
process.on('unhandledRejection', (err, promise) => {
  // Log the error
  console.log(`Error: ${err.message}`.red);
  // Close the server and exit the process
  server.close(() => process.exit(1));
});
