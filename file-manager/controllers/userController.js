const User = require('../models/userModel');
const jwt = require('jsonwebtoken');

/**
 * @swagger
 * /api/users/register:
 *   post:
 *     summary: Registers a new user
 *     description: This endpoint allows users to sign up with their username, email, and password. It checks if the user already exists and returns an error if so. If successful, it registers the user and returns a success message.
 *     parameters:
 *       - in: header
 *         name: Accept-Language
 *         required: false
 *         description: The language in which the response should be returned. Defaults to English.
 *         schema:
 *           type: string
 *           example: en
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - email
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *                 example: john_doe
 *                 description: The unique username for the user.
 *               email:
 *                 type: string
 *                 example: john@example.com
 *                 description: The unique email address of the user.
 *               password:
 *                 type: string
 *                 example: password123
 *                 description: The user's password.
 *     responses:
 *       201:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User registered successfully
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: 609bbd5e6c1a0010a2a0a1a9
 *                     username:
 *                       type: string
 *                       example: john_doe
 *                     email:
 *                       type: string
 *                       example: john@example.com
 *       400:
 *         description: User already exists
 *       500:
 *         description: Error registering user
 */


const registerUser = async (req, res) => {
  try {
    // Dynamically set language using the Accept-Language header
    const language = req.headers['accept-language'] || 'en';
    req.i18n.changeLanguage(language.split(',')[0]);

    const { username, email, password } = req.body;
    console.log("Registering user...");

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: req.t('errors.user_exists') });
    }

    // Create and save new user
    const user = new User({
      username,
      email,
      password,
    });

    await user.save();
    res.status(201).json({
      message: req.t('success.registration_successful'),
      user: { id: user._id, username: user.username, email: user.email },
    });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ message: req.t('errors.server_error'), error });
  }
};

/**
 * @swagger
 * /api/users/login:
 *   post:
 *     summary: Logs in an existing user
 *     description: This endpoint allows users to log in by providing their email and password. If the credentials are valid, a JWT token will be returned.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: john@example.com
 *                 description: The email address of the user.
 *               password:
 *                 type: string
 *                 example: password123
 *                 description: The user's password.
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Login successful
 *                 token:
 *                   type: string
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: 609bbd5e6c1a0010a2a0a1a9
 *                     username:
 *                       type: string
 *                       example: john_doe
 *                     email:
 *                       type: string
 *                       example: john@example.com
 *       400:
 *         description: Invalid credentials
 *       500:
 *         description: Error logging in user
 */


const loginUser = async (req, res) => {
  const { email, password } = req.body;

  // Validate input
  if (!email || !password) {
    return res.status(400).json({ message: 'Please provide both email and password' });
  }

  try {
    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check if password is correct
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '30d' });

    // Respond with token and user details
    res.json({
      message: 'Login successful',
      token,
      user: { id: user._id, username: user.username, email: user.email },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: req.t('errors.server_error')});
  }
};


module.exports = { registerUser, loginUser };
