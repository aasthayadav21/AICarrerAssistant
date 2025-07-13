// models/SavedJob.js
const mongoose = require('mongoose');

const SavedJobSchema = new mongoose.Schema({
  userEmail: { type: String, required: true },
  jobId: { type: String, required: true },
  jobData: { type: Object, required: true },
  resumeName: { type: String, required: true },
  savedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('SavedJob', SavedJobSchema);
