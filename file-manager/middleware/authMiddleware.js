const jwt = require('jsonwebtoken');
const User = require('../models/userModel'); // Import the User model to fetch user details from the database

const protect = async (req, res, next) => {
  let token;

  // Check if the Authorization header contains a token
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer ')
  ) {
    try {
      // Extract the token from the header
      token = req.headers.authorization.split(' ')[1];

      // Verify the token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Attach user details to the request object
      // Fetch user details from the database without the password field
      req.user = await User.findById(decoded.userId).select('-password');

      if (!req.user) {
        return res.status(401).json({ message: 'User not found' });
      }

      // Proceed to the next middleware or route handler
      next();
    } catch (error) {
      console.error('Error with token:', error.message);
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  } else {
    // If no token is provided, return an error
    res.status(401).json({ message: 'No token, not authorized' });
  }
};

module.exports = protect;
