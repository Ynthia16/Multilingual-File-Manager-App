const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Use the correct MongoDB URI from the environment variable
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/file-manager', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected successfully');
  } catch (err) {
    console.error('MongoDB connection failed:', err);
    process.exit(1); // Exit process on failure
  }
};

module.exports = connectDB;

