const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB connected successfully');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    console.log('⚠️  Server will continue without database. Install and start MongoDB to enable message persistence.');
    // Don't exit - allow server to run without DB for testing
  }
};

module.exports = connectDB;
