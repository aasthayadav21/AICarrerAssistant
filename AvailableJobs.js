import React, { useState, useEffect } from 'react';
import axios from 'axios';
import JobCard from '../components/JobCard';
import { useAuth } from '../context/AuthContext';
import { useLocation } from 'react-router-dom';

export default function AvailableJobs() {
  const [jobs, setJobs] = useState([]);
  const { user } = useAuth();
  const location = useLocation();

  // Get suggestions and skills from navigation state
  const { suggestions = [], skills = [], resumeName = 'DefaultResume' } = location.state || {};
  const keyword = suggestions[0] || skills[0] || 'developer';
  console.log("suggestions:", suggestions);
  console.log("Resume Name:", resumeName);

  // Fetch jobs from backend based on keyword
  useEffect(() => {
    async function fetchJobs() {
      try {
        const res = await axios.post(
          'http://localhost:5000/api/jobs/by-suggestions',
          { suggestions }
        );
        setJobs(res.data);
      } catch (err) {
        console.error('Error fetching...', err);
      }
    }

    if (suggestions.length > 0) fetchJobs();
  }, [suggestions]);

  // ✅ Correct Save job handler
  const handleSave = async (job) => {
    if (!user) return alert('Please log in to save jobs.');

    const jobToSave = {
      id: job.id || job.url || Date.now(),
      title: job.title || 'Untitled Job',
      company: job.company_name || job.company || 'Unknown Company',
      link: job.url || job.link || '#',
      location: job.location || 'Remote',
    };

    try {
      await axios.post('http://localhost:5000/api/jobs/save', {
        userEmail: user.email,
        resumeName: resumeName, // ✅ Send the resume name
        job: jobToSave,
      });
      alert('✅ Job saved!');
    } catch (err) {
      console.error('❌ Failed to save job:', err);
      alert('❌ Failed to save job.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Available Jobs for "{keyword}"</h1>
      {jobs.length > 0 ? (
        jobs.map((job) => (
          <JobCard
            key={job.id || job.url || Math.random()}
            job={job}
            onSave={() => handleSave(job)}
          />
        ))
      ) : (
        <p>No matching jobs found.</p>
      )}
    </div>
  );
}
