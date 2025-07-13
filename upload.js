const express = require('express');
const multer = require('multer');
const fs = require('fs');
const router = express.Router();
const path = require('path');

// Upload setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) =>
    cb(null, Date.now() + '-' + file.originalname),
});
const upload = multer({ storage });

// Resume Upload Route
router.post('/upload', upload.single('resume'), (req, res) => {
  const filepath = path.join(__dirname, '..', 'uploads', req.file.filename);

  // Simulate AI analysis
  const sampleSkills = ['JavaScript', 'React', 'Node.js'];
  const sampleJobs = [
    'Frontend Developer',
    'Full Stack Engineer',
    'React Developer',
  ];

  res.status(200).json({
    message: 'Resume uploaded successfully',
    skills: sampleSkills,
    suggestions: sampleJobs,
  });
});

module.exports = router;
