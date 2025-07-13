const express = require('express');
const multer = require('multer');
const cors = require('cors');
const fs = require('fs');
const pdfParse = require('pdf-parse');
const path = require('path');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('./models/user');
require('dotenv').config();

const scrapeJobsFromWWR = require('./scrapers/weWorkRemotelyScraper');
const scrapeJobsFromRemoteOK = require('./scrapers/remoteOkScraper');
const scrapeJobsFromIndeed = require('./scrapers/indeedScraper');
const scrapeJobsFromInternshala = require('./scrapers/internshalaScraper');
const analyzeResume = require('./gemini');
const SavedJob = require('./models/SavedJob');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// Multer config
const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname),
});
const upload = multer({ storage });

// Resume name normalization helper
const normalizeResumeName = (name) => name.toLowerCase().trim();

// Test route
app.get('/', (req, res) => {
  res.send('Career Assistant backend is running!');
});

// POST /api/auth/signup
app.post('/api/auth/signup', async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashed = await bcrypt.hash(password, 10);
    const newUser = new User({ username, email, password: hashed });
    await newUser.save();

    res.status(201).json({ username: newUser.username, email: newUser.email });
  } catch (err) {
    console.error('Signup error:', err.message);
    res.status(500).json({ message: 'Server error during signup' });
  }
});

// POST /api/auth/login
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'User not found' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Incorrect password' });

    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '2h' }
    );

    res.json({ token, user: { username: user.username, email: user.email } });
  } catch (err) {
    console.error('Login error:', err.message);
    res.status(500).json({ message: 'Server error during login' });
  }
});

// Resume Upload + Gemini Analysis
app.post('/upload', upload.single('resume'), async (req, res) => {
  try {
    const filePath = path.join(__dirname, req.file.path);
    const dataBuffer = fs.readFileSync(filePath);
    const pdfData = await pdfParse(dataBuffer);
    const resumeText = pdfData.text;
    const result = await analyzeResume(resumeText);

    const cleanedResumeName = normalizeResumeName(req.file.originalname);

    res.json({
      message: 'Resume processed successfully!',
      resumeName: cleanedResumeName,
      suggested_roles: result.suggested_roles || [],
      skills_found: result.skills_found || { technical: [], soft: [] },
      missing_skills: result.missing_skills || [],
      career_advice: result.career_advice || '',
    });

    fs.unlinkSync(filePath);
  } catch (err) {
    console.error('❌ Error processing resume:', err);
    res.status(500).json({ message: 'Failed to process resume' });
  }
});

// Job Scraping Route
app.post('/api/jobs/by-suggestions', async (req, res) => {
  const { suggestions = [], skills = [] } = req.body;
  const keywords = [...suggestions, ...skills];

  if (keywords.length === 0) {
    return res.status(400).json({ message: 'No keywords provided for scraping' });
  }

  try {
    const [wwr, remoteok, indeed, internshala] = await Promise.all([
      scrapeJobsFromWWR(keywords),
      scrapeJobsFromRemoteOK(keywords),
      scrapeJobsFromIndeed(keywords),
      scrapeJobsFromInternshala(keywords),
    ]);

    const combined = [...wwr, ...remoteok, ...indeed, ...internshala];
    console.log('✅ Total jobs scraped:', combined.length);

    res.json(combined.slice(0, 25));
  } catch (err) {
    console.error('❌ Scraping failed:', err.message);
    res.status(500).json({ message: 'Job scraping failed.' });
  }
});


// POST /api/jobs/save
app.post('/api/jobs/save', async (req, res) => {
  const { userEmail, job, resumeName } = req.body;

  if (!userEmail || !job || !resumeName) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  const savedJob = new SavedJob({
    title:job.title,
    company: job.company,
    userEmail,
    jobId: job.id || job.url || job.link,
    jobData: job,
    resumeName: resumeName.trim().toLowerCase(),
  });

  try {
    await savedJob.save();
    res.json({ message: 'Job saved successfully' });
  } catch (err) {
    console.error('❌ Save error:', err.message);
    res.status(500).json({ message: 'Failed to save job' });
  }
});


// Get all saved jobs for a specific resume
app.get('/api/jobs/saved', async (req, res) => {
  let { userEmail, resumeName } = req.query;

  if (!userEmail || !resumeName) {
    return res.status(400).json({ message: 'Missing userEmail or resumeName' });
  }

  resumeName = normalizeResumeName(resumeName);
  console.log('🔍 Fetching saved jobs for:', userEmail, resumeName);

  try {
    const jobs = await SavedJob.find({ userEmail, resumeName });
    res.json(jobs);
  } catch (err) {
    console.error('❌ Failed to fetch saved jobs:', err.message);
    res.status(500).json({ message: 'Failed to fetch saved jobs' });
  }
});

// Get all resume names for a user
app.get('/api/jobs/resume-names', async (req, res) => {
  const { userEmail } = req.query;

  if (!userEmail) {
    return res.status(400).json({ message: 'Missing user email' });
  }

  try {
    const resumeNames = await SavedJob.distinct('resumeName', { userEmail });
    res.json(resumeNames);
  } catch (err) {
    console.error('❌ Error fetching resume names:', err.message);
    res.status(500).json({ message: 'Failed to fetch resume names' });
  }
});

// Delete a saved job
app.delete('/api/jobs/unsave/:jobId', async (req, res) => {
  const { jobId } = req.params;
  const { userEmail } = req.body;

  if (!jobId || !userEmail) {
    return res.status(400).json({ message: 'Missing jobId or userEmail' });
  }

  try {
    const deleted = await SavedJob.findOneAndDelete({ _id: jobId, userEmail });

    if (!deleted) {
      return res.status(404).json({ message: 'Job not found for this user' });
    }

    res.json({ message: '🗑 Job unsaved successfully' });
  } catch (err) {
    console.error('❌ Unsave failed:', err.message);
    res.status(500).json({ message: 'Server error while unsaving job' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
