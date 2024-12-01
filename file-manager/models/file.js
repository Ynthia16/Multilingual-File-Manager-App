const mongoose = require('mongoose');

// File Schema
const fileSchema = new mongoose.Schema({
  filename: {
    type: String,
    required: true,
  },
  originalname: {
    type: String,
    required: true,
  },
  size: {
    type: Number,
    required: true,
  },
  path: {
    type: String,
    required: true,
  },
  mimetype: {
    type: String,
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',  // Associate the file with a user
    required: true,
  },
}, {
  timestamps: true, // Automatically create `createdAt` and `updatedAt` fields
});

// Create the File model
const File = mongoose.model('File', fileSchema);

module.exports = File;
