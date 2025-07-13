import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import JobCard from './JobCard';
import './JobsPage.css';

function SavedJobs() {
  const { user } = useAuth();
  const { state } = useLocation();
  const resumeName = state?.resumeName || 'Unnamed Resume';
  const cleanResumeName = resumeName.trim().toLowerCase();

  const [savedJobs, setSavedJobs] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchSavedJobs = async () => {
      if (!user?.email || !cleanResumeName) return;

      try {
        const res = await axios.get('http://localhost:5000/api/jobs/saved', {
          params: {
            userEmail: user.email,
            resumeName: cleanResumeName,
          },
        });
        setSavedJobs(res.data);
      } catch (err) {
        console.error('❌ Failed to fetch saved jobs:', err.message);
        setError('❌ Failed to fetch saved jobs');
      }
    };

    fetchSavedJobs();
  }, [user, cleanResumeName]);

  const handleUnsave = async (jobId) => {
    try {
      await axios.delete(`http://localhost:5000/api/jobs/unsave/${jobId}`, {
        data: { userEmail: user.email },
      });

      setSavedJobs((prev) => prev.filter((job) => job._id !== jobId));
    } catch (err) {
      alert('❌ Failed to unsave job');
    }
  };

  return (
    <div className="saved-jobs-container">
      <h1>💾 Saved Jobs for Resume: {resumeName}</h1>
      {error && <p>{error}</p>}
      {savedJobs.length === 0 && !error ? (
        <p>No jobs saved yet.</p>
      ) : (
        <div className="jobs-grid">
          {savedJobs.map((job) => (
            <JobCard
              key={job._id}
              job={{ ...job.jobData, _id: job._id }} // ✅ flatten jobData
              onUnsave={() => handleUnsave(job._id)}
              showUnsave={true}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default SavedJobs;
