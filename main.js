const express = require('express');
const app = express();
const mongoose = require('mongoose');
require('dotenv').config();

// Connect to MongoDB database
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('MongoDB connected'))
  .catch(error => console.error(error));

// Middleware to parse JSON data in the request body
app.use(express.json());

// API routes
app.use('/api', require('./routes/index'));

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));

