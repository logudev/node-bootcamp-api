const fs = require('fs');
const mongoose = require('mongoose');
const colors = require('colors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// Initialize env vars
dotenv.config({ path: './config/config.env' });

// Load models
const Bootcamp = require('./models/Bootcamp');

// Read from JSON files
const bootcamps = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/bootcamps.json`, 'utf-8')
);

// Import Bootcamp data

const insertData = async () => {
  try {
    // Connect to DB
    await connectDB();
    // Insert data into DB
    await Bootcamp.create(bootcamps);
    console.log('Bootcamp Data imported'.green.inverse);
  } catch (error) {
    console.error(error);
  }
  process.exit();
};

// Delete Bootcamp data

const deleteData = async () => {
  try {
    // Connect to DB
    await connectDB();
    // Delete data from DB
    await Bootcamp.deleteMany();
    console.log('Bootcamp Data Deleted'.green.inverse);
  } catch (error) {
    console.error(error);
  }
  process.exit();
};

// Check if the argument is for
// Inserting - i  ->  node dataSeeder -i
// Deleting  - d  ->  node dataSeeder -d

if (process.argv[2] === '-i') {
  insertData();
} else if (process.argv[2] === '-d') {
  deleteData();
}
