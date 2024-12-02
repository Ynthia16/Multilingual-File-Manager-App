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
    ref: 'User',  
    required: true,
  },
}, {
  timestamps: true,
});

// Create the File model
const File = mongoose.model('File', fileSchema);

module.exports = File;
