const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/file-manager', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('MongoDB connected successfully'))
  .catch(err => console.log('Error connecting to MongoDB:', err));
