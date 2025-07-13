import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import JobCard from './JobCard';
import './JobsPage.css';

function JobsPage() {
  const { state } = useLocation();
  const { suggestions = [], skills = [], resumeName = '' } = state || {};
  const { user } = useAuth();

  const [jobs, setJobs] = useState([]);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState({});

  // ✅ Clean resume name (normalize for DB consistency)
  const cleanResumeName = resumeName?.trim().toLowerCase() || 'default_resume';

  useEffect(() => {
    async function fetchJobs() {
      try {
        const res = await axios.post('http://localhost:5000/api/jobs/by-suggestions', {
          suggestions,
          skills,
        });
        setJobs(res.data);
      } catch (err) {
        console.error('❌ Failed to fetch jobs:', err.message);
        setError('Could not fetch jobs.');
      }
    }

    if (suggestions.length > 0 || skills.length > 0) {
      fetchJobs();
    }
  }, [suggestions, skills]);

  const saveJob = async (job) => {
    if (!user) {
      return alert('Please login to save jobs.');
    }

    const jobKey = job.id || job.url || job.link || job.title + job.company;
    setSaving(prev => ({ ...prev, [jobKey]: true }));

    try {
      await axios.post('http://localhost:5000/api/jobs/save', {
        userEmail: user.email,
        job,
        resumeName: cleanResumeName,
      });
      alert('✅ Job saved!');
    } catch (err) {
      if (err.response?.status === 409) {
        alert('⚠️ This job is already saved for this resume.');
      } else {
        alert('❌ Error saving job.');
        console.error('❌ Save error:', err);
      }
    } finally {
      setSaving(prev => ({ ...prev, [jobKey]: false }));
    }
  };

  return (
    <div className="jobs-container">
      <h1>📄 Available Jobs for Resume: {resumeName || 'Unnamed Resume'}</h1>

      {error && <p className="error">{error}</p>}
      {jobs.length === 0 && !error && <p>Loading jobs...</p>}

      <div className="jobs-grid">
        {jobs.map((job, idx) => (
          <JobCard
            key={`${job.id || job.url || job.link || job.title}-${idx}`} // ✅ safer unique key
            job={job}
            onSave={saveJob}
            isSaving={saving[job.id || job.url || job.link || job.title + job.company]}
          />
        ))}
      </div>
    </div>
  );
}

export default JobsPage;
