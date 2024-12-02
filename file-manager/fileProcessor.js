
const fs = require('fs');
const path = require('path');

async function processFileUpload(file) {
  try {

    const uploadDir = path.join(__dirname, 'uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const filePath = path.join(uploadDir, file.originalname);
    await fs.promises.writeFile(filePath, file.buffer);

    console.log(`File saved at: ${filePath}`);
    return { success: true, filePath };
  } catch (error) {
    console.error('File processing error:', error);
    return { success: false, error: error.message };
  }
}

module.exports = { processFileUpload };
