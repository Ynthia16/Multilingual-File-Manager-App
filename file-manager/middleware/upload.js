const multer = require('multer');
const path = require('path');


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads'); 
  },
  filename: (req, file, cb) => {
    const fileExtension = path.extname(file.originalname);
    const filename = `${Date.now()}${fileExtension}`; 
    cb(null, filename);
  },
});


const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type'), false);
  }
};


const upload = multer({
  dest: 'uploads/' ,
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, 
});

module.exports = upload;
