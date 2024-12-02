const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const cors = require('cors');
const i18next = require('./i18n');
const i18nextMiddleware = require('i18next-http-middleware');
const cookieParser = require('cookie-parser');
const path = require('path');
const userRoutes = require('./routes/userRoutes');
const Queue = require('bull');
const Redis = require('redis');
const authenticateToken = require('./middleware/authMiddleware');
const { processFileUpload } = require('./fileProcessor');
const upload = require('./middleware/upload');

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// Redis Client Setup (Single Client)

const uploadQueue = new Queue('uploadQueue', {
  redis: {
    host:'host.docker.internal',
    port: 6379
  }
});
const redisClient = Redis.createClient('redis://127.0.0.1:6379');

redisClient.on('connect', () => {
  console.log('Connected to Redis');
});

redisClient.on('error', (err) => {
  console.error('Redis connection error:', err);
  process.exit(1); 
});

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('Error connecting to MongoDB:', err));

// Middlewares
app.use(express.json());
app.use(cors());
app.use(cookieParser());
app.use(i18nextMiddleware.handle(i18next));
app.use('/locales', express.static(path.join(__dirname, 'locales')));

// Language Middleware
app.use((req, res, next) => {
  const language = req.headers['accept-language'] || 'en';
  i18next.changeLanguage(language.split(',')[0]);
  next();
});

// Swagger Configuration
const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'File Manager API',
      version: '1.0.0',
      description: 'API for managing files and user authentication',
      contact: {
        name: 'Developer',
        email: 'developer@example.com',
      },
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT || 5000}`,
      },
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [{ BearerAuth: [] }],
  },
  apis: ['./routes/*.js'],
};
const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Routes
app.use('/api/users', userRoutes);


// File Upload Route
app.post('/upload-profile-image', authenticateToken, upload.single('file'), async (req, res) => {
  console.log('Upload profile image endpoint hit');

  try {
    if (!req.file) {
      console.warn('No file uploaded');
      return res.status(400).json({ message: 'No file uploaded' });
    }

    console.log('File details:', {
      filename: req.file.filename,
      originalname: req.file.originalname,
      size: req.file.size,
      path: req.file.path,
      mimetype: req.file.mimetype,
    });

    // Add the job to the queue for processing
    const job = await uploadQueue.add({ file: req.file });
      console.log('File details:', req.file);
      console.log('Job added:', job);
      console.log(`Job ${job.id} added to the queue`);

    // Respond to the client with success
    return res.status(200).json({
      success: true,
      message: 'File uploaded successfully and queued for processing',
      file: req.file,
      jobId: job.id,
    });
  } catch (error) {
    console.error('Error during file upload:', error);
    return res.status(500).json({
      success: false,
      message: 'An error occurred while uploading the file',
      error: error.message,
    });
  }
});

// Job Event Listeners
uploadQueue.on('completed', (job) => {
  console.log(`Job ${job.id} completed`);
});

uploadQueue.on('failed', (job, error) => {
  console.error(`Job ${job.id} failed: ${error.message}`);
});

// Process Queue Jobs
uploadQueue.process(async (job) => {
  console.log(`Processing job ${job.id}`);
  const file = job.data.file;

  // Simulate file processing (e.g., file manipulation)
  await new Promise((resolve) => setTimeout(resolve, 2000));

  console.log(`Processed file: ${file.originalname}`);
  return Promise.resolve();
});

// User Login Route
app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await user.findOne({ username });
  if (user) {
    const userLang = user.language || 'en';
    res.cookie('i18next', userLang, { maxAge: 900000, httpOnly: true }); 
    return res.json({ message: req.t('welcome') });
  }
  res.status(400).json({ message: 'User not found' });
});

// Start Server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
