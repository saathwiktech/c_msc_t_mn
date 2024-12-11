const mongoose = require('mongoose');

async function connectDB() {
  // const MONGO_URI = 'mongodb://127.0.0.1:27017/testingphase';
  
  try {
    await mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('Connected to database');
  } catch (error) {
    console.error('Error connecting to database:', error);
  }
}

module.exports = connectDB;
