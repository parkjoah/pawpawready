const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const mongoURI = 'mongodb://127.0.0.1:27017/myDatabase';
    await mongoose.connect(mongoURI);
    console.log('✅ MongoDB connected successfully');
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error);
    process.exit(1);
  }
};

module.exports = connectDB;
