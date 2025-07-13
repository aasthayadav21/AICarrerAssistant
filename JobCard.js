import React, { useState } from 'react';

export default function JobCard({ job, onSave, onUnsave, showUnsave = false }) {
  const [saving, setSaving] = useState(false);

  const formattedJob = {
    id:
      job.id ||
      job.jobId ||
      job._id || // For saved jobs
      job.url ||
      job.link ||
      `${job.title || 'unknown'}-${job.company || 'unknown'}-${Date.now()}`,
    title: job.title || 'Untitled Role',
    company: job.company || job.company_name || 'Unknown',
    link: job.link || job.url || '#',
    location: job.location || 'Remote',
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await onSave(formattedJob);
    } catch (err) {
      console.error('❌ Error saving job:', err.message);
    }
    setSaving(false);
  };

  const handleUnsave = async () => {
    if (onUnsave) {
      await onUnsave();
    }
  };

  return (
    <div className="job-card border p-5 mb-5 rounded-lg shadow-md bg-white">
      <h2 className="text-xl font-bold text-gray-800">{formattedJob.title}</h2>
      <p className="text-gray-600 mt-1">🏢 <strong>{formattedJob.company}</strong></p>
      <p className="text-gray-500">📍 {formattedJob.location}</p>

      <div className="mt-4 flex items-center gap-4 flex-wrap">
        <a
          href={formattedJob.link}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          🔗 Apply Now
        </a>
        <br/>
        <br/>
        {showUnsave ? (
          <button
            className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700 transition"
            onClick={handleUnsave}
          >
            ❌ Unsave
          </button>
        ) : (
          <button
            className={`px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700 transition ${
              saving ? 'opacity-70 cursor-not-allowed' : ''
            }`}
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? 'Saving...' : 'Save Job'}
          </button>
        )}
      </div>
    </div>
  );
}
