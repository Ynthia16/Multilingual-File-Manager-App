const uploadProfileImage = (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }

  const filePath = `/uploads/${req.file.filename}`;

  // Example: Save the file path in the user's profile (you can modify this part as per your requirements)
  User.findByIdAndUpdate(req.user._id, { profileImage: filePath })
    .then(() => {
      return res.status(200).json({
        message: 'Profile image uploaded successfully',
        imageUrl: filePath,
      });
    })
    .catch((error) => {
      console.error('Error saving profile image:', error.message);
      res.status(500).json({ message: 'Internal server error' });
    });
};

module.exports = uploadProfileImage;
