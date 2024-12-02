const express = require('express');
const multer = require('multer');
const fs = require('fs').promises;
const path = require('path');
require('dotenv').config();

const { registerUser, loginUser } = require('../controllers/userController');
const protect = require('../middleware/authMiddleware');
const File = require('../models/file'); 

const router = express.Router();


const uploadDir = path.join(__dirname, '../uploads/');
fs.mkdir(uploadDir, { recursive: true }).catch((err) => {
  console.error('Error creating upload directory:', err);
});

// Multer configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png'];
    if (!allowedTypes.includes(file.mimetype)) {
      return cb(new Error('Invalid file type. Only JPEG and PNG are allowed.'));
    }
    cb(null, true);
  },
  limits: { fileSize: 2 * 1024 * 1024 }, 
});

/**
 * @swagger
 * /api/users/register:
 *   post:
 *     tags:
 *       - Users
 *     summary: Register a new user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: User created successfully
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Internal server error
 */
router.post('/register', registerUser);

/**
 * @swagger
 * /api/users/login:
 *   post:
 *     tags:
 *       - Users
 *     summary: Log in a user
 *     description: Authenticate a user and return a JWT token.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *       401:
 *         description: Invalid credentials
 *       500:
 *         description: Internal server error
 */
router.post('/login', loginUser);

/**
 * @swagger
 * /api/users/profile:
 *   get:
 *     tags:
 *       - Users
 *     summary: Get user profile
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: Accept-Language
 *         in: header
 *         required: false
 *         description: The language for the response
 *         schema:
 *           type: string
 *           default: en
 *     responses:
 *       200:
 *         description: User profile data
 *       401:
 *         description: Unauthorized
 */
router.get('/profile', protect, (req, res) => {
  const baseUrl = process.env.BASE_URL || 'http://localhost:5000';
  const profileImageUrl = req.user.profileImagePath
    ? `${baseUrl}/uploads/${req.user.profileImagePath}`
    : null;

  res.json({
    success: true,
    data: {
      id: req.user._id,
      username: req.user.username,
      email: req.user.email,
      profileImage: profileImageUrl,
    },
  });
});

/**
 * @swagger
 * /api/users/upload-profile-image:
 *   post:
 *     tags:
 *       - Users
 *     summary: Upload a profile image
 *     parameters:
 *       - name: Accept-Language
 *         in: header
 *         required: false
 *         description: The language for the response
 *         schema:
 *           type: string
 *           default: en
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: File uploaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                   example: File uploaded successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     filename:
 *                       type: string
 *                     originalname:
 *                       type: string
 *                     size:
 *                       type: integer
 *                     path:
 *                       type: string
 *                     mimetype:
 *                       type: string
 *       400:
 *         description: No file uploaded
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                   example: No file uploaded
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                   example: Unauthorized
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                   example: Error saving file metadata
 */

router.post('/upload-profile-image', protect, upload.single('file'), async (req, res) => {
  console.log('Upload profile image endpoint hit');

  if (!req.file) {
    console.warn('No file uploaded');
    return res.status(400).json({ message: 'No file uploaded' });
  }

  console.log('File details:', req.file);

  try {
    const fileMetadata = new File({
      filename: req.file.filename,
      originalname: req.file.originalname,
      size: req.file.size,
      path: req.file.path,
      mimetype: req.file.mimetype,
      userId: req.user._id,
    });

    await fileMetadata.save();

    req.user.profileImagePath = req.file.filename;
    await req.user.save();

    console.log('File uploaded and saved successfully');
    res.status(200).json({ success: true, data: fileMetadata });
  } catch (err) {
    console.error('Error during file save:', err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});


/**
 * @swagger
 * /api/users/files:
 *   get:
 *     tags:
 *       - Users
 *     summary: View uploaded files
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: Accept-Language
 *         in: header
 *         required: false
 *         description: The language for the response
 *         schema:
 *           type: string
 *           default: en
 *     responses:
 *       200:
 *         description: List of files
 *       500:
 *         description: Internal server error
 */
router.get('/files', protect, async (req, res) => {
  try {
    const files = await File.find({ userId: req.user._id });
    res.status(200).json({ success: true, data: files });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error fetching files', error: err.message });
  }
});

/**
 * @swagger
 * /api/users/files/{fileId}:
 *   get:
 *     tags:
 *       - Users
 *     summary: View a specific uploaded file
 *     parameters:
 *       - name: fileId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *       - name: Accept-Language
 *         in: header
 *         required: false
 *         description: The language for the response
 *         schema:
 *           type: string
 *           default: en
 *     responses:
 *       200:
 *         description: File metadata
 *       404:
 *         description: File not found
 *       500:
 *         description: Internal server error
 */
router.get('/files/:fileId', protect, async (req, res) => {
  try {
    const file = await File.findById(req.params.fileId);
    if (!file) {
      return res.status(404).json({ success: false, message: 'File not found' });
    }
    res.status(200).json({ success: true, data: file });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error fetching file', error: err.message });
  }
});

/**
 * @swagger
 * /api/users/files/{fileId}:
 *   delete:
 *     tags:
 *       - Users
 *     summary: Delete an uploaded file
 *     parameters:
 *       - name: fileId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: File deleted successfully
 *       404:
 *         description: File not found
 *       500:
 *         description: Internal server error
 */
router.delete('/files/:fileId', protect, async (req, res) => {
  try {
    const file = await File.findById(req.params.fileId);
    if (!file) {
      return res.status(404).json({ success: false, message: 'File not found' });
    }

    await fs.unlink(path.join(uploadDir, file.filename));
    await file.remove();

    res.status(200).json({ success: true, message: 'File deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error deleting file', error: err.message });
  }
});

module.exports = router;
