const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/neuroloop';
    const conn = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 5000, 
    });
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (err) {
    console.error(`❌ MongoDB Connection Error: ${err.message}`);
    console.warn('⚠️  Continuing server startup. Some features requiring MongoDB may not work.');
  }
};

module.exports = connectDB;