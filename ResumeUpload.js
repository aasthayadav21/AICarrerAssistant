import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { gsap } from 'gsap';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoginForm from './LoginForm';
import SignupForm from './SignupForm';
import '../App.css';

function ResumeUpload() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const uploadRef = useRef(null);
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected && selected.type !== 'application/pdf') {
      alert('❌ Please upload a valid PDF file.');
      return;
    }
    setFile(selected);
  };

  const handleUpload = async () => {
    if (!isLoggedIn) {
      alert('⚠️ Please login or signup to upload your resume.');
      setShowLogin(true);
      return;
    }

    if (!file) {
      alert('Please select a resume file first.');
      return;
    }

    const formData = new FormData();
    formData.append('resume', file);

    try {
      setLoading(true);
      const res = await axios.post('http://localhost:5000/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      const {
        suggested_roles = [],
        skills_found = { technical: [], soft: [] },
        missing_skills = [],
        career_advice = '',
        resumeName,
      } = res.data;

      // ✅ Store resume name for later use (e.g., Saved Jobs)
      localStorage.setItem('latestResumeName', resumeName);

      navigate('/results', {
        state: {
          suggested_roles,
          skills_found,
          missing_skills,
          career_advice,
          resumeName,
        },
      });
    } catch (err) {
      console.error('❌ Upload failed:', err);
      alert('❌ Upload failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    gsap.fromTo(
      uploadRef.current,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 1, ease: 'power2.out', delay: 0.4 }
    );
  }, []);

  return (
    <div className="resume-upload-wrapper" ref={uploadRef}>
      <div className="resume-info-left">
        <h2>📄 Upload Your Resume</h2>
        <p>
          Let our AI analyze your resume and suggest job roles, missing skills, and improvement advice.
        </p>
      </div>

      <div className="resume-upload-box">
        <h3>Choose Your PDF Resume</h3>
        <div className="upload-input-wrapper">
          <label htmlFor="resumeFile">Select Resume (PDF only)</label>
          <input
            type="file"
            id="resumeFile"
            accept=".pdf"
            onChange={handleFileChange}
          />
          {file && <div className="file-name-display">📄 {file.name}</div>}
        </div>

        <button
          className="resume-upload-btn-custom"
          onClick={handleUpload}
          disabled={loading}
        >
          {loading ? '🔄 Analyzing...' : '🚀 Start AI Analysis'}
        </button>
      </div>

      {/* Login Modal */}
      {showLogin && (
        <div className="auth-modal">
          <LoginForm
            onClose={() => setShowLogin(false)}
            onSignupClick={() => {
              setShowLogin(false);
              setShowSignup(true);
            }}
          />
        </div>
      )}

      {/* Signup Modal */}
      {showSignup && (
        <div className="auth-modal">
          <SignupForm
            onClose={() => setShowSignup(false)}
            onLoginClick={() => {
              setShowSignup(false);
              setShowLogin(true);
            }}
          />
        </div>
      )}
    </div>
  );
}

export default ResumeUpload;
