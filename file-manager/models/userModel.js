const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const File = require('./file'); // Import the File model

/**
 * @swagger
 * definitions:
 *   User:
 *     type: object
 *     required:
 *       - username
 *       - email
 *       - password
 *     properties:
 *       username:
 *         type: string
 *         description: The user's unique username
 *         example: john_doe
 *       email:
 *         type: string
 *         description: The user's email address (should be unique)
 *         example: john@example.com
 *       password:
 *         type: string
 *         description: The user's hashed password (it will be hashed before saving)
 *         example: password123
 * 
 * @swagger
 * models:
 *   User:
 *     type: object
 *     required:
 *       - username
 *       - email
 *       - password
 *     properties:
 *       username:
 *         type: string
 *         example: john_doe
 *       email:
 *         type: string
 *         example: john@example.com
 *       password:
 *         type: string
 *         example: password123
 */

// User Schema
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },
  profileImagePath: {
    type: String,  // Storing the profile image path
    default: null,
  },
  files: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'File'  // Reference to the File model
  }],
}, { timestamps: true });  // Automatically adds createdAt and updatedAt fields

// Hash password before saving user document
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare provided password with stored hashed password
userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Create the User model
const User = mongoose.model('User', userSchema);

module.exports = User;
