const multer = require('multer');
const path = require('path');


// Setup the file storage destination and filename
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads'); // You can change the path if needed
  },
  filename: (req, file, cb) => {
    const fileExtension = path.extname(file.originalname);
    const filename = `${Date.now()}${fileExtension}`; // Add a timestamp to the filename to avoid duplicates
    cb(null, filename);
  },
});

// Filter for allowed file types (optional)
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type'), false);
  }
};

// Set up multer with storage and fileFilter
const upload = multer({
  dest: 'uploads/' ,
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // Max file size 5MB
});

module.exports = upload;
