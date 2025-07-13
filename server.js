const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

const authRoutes = require('./routes/auth');
const uploadRoutes = require('./routes/upload');
const jobRoutes = require('./routes/jobs'); 

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Serve uploaded files if needed
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ✅ API Routes
app.use('/api/auth', authRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/jobs', jobRoutes); // ✅ Add job-related routes

// ✅ MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('✅ MongoDB connected');
  app.listen(process.env.PORT || 5000, () =>
    console.log(`🚀 Server running on port ${process.env.PORT || 5000}`)
  );
})
.catch((err) => {
  console.error('❌ DB connection error:', err);
});
