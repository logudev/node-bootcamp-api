const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false,
      useUnifiedTopology: true,
    });
    console.log(
      `MongoDB connected, host: ${conn.connection.host}`.cyan.underline.italic
    );
  } catch (error) {
    throw error;
  }
};

module.exports = connectDB;
