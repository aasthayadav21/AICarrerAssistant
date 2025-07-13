const express = require('express');
const router = express.Router();
const axios = require('axios');
const SavedJob = require('../models/SavedJob');

// GET /api/jobs?keyword=developer
router.get('/', async (req, res) => {
  const { keyword } = req.query;

  try {
    const response = await axios.get('https://www.arbeitnow.com/api/job-board-api');
    const allJobs = response.data.data;

    const filtered = keyword
      ? allJobs.filter(j =>
          j.title.toLowerCase().includes(keyword.toLowerCase())
        )
      : allJobs;

    res.json(filtered.slice(0, 20));
  } catch (err) {
    console.error('Error fetching jobs:', err.message);
    res.status(500).json({ message: 'Failed to fetch jobs' });
  }
});

// POST /api/jobs/save
router.post('/save', async (req, res) => {
  const { userEmail, job } = req.body;

  if (!userEmail || !job) {
    return res.status(400).json({ message: 'Missing data' });
  }

  try {
    const jobId = job.slug || job.id || job.url; // fallback
    const exists = await SavedJob.findOne({ userEmail, jobId });

    if (exists) {
      return res.status(409).json({ message: 'Already saved' });
    }

    await SavedJob.create({
      userEmail,
      jobId,
      title: job.title || 'Untitled',
      company: job.company_name || 'Unknown Company',
      link: job.url || '#',
    });

    res.json({ message: 'Saved successfully' });
  } catch (err) {
    console.error('Error saving job:', err.message);
    res.status(500).json({ message: 'Failed to save job' });
  }
});

module.exports = router;
