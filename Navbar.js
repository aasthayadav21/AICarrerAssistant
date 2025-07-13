// src/components/Navbar.js
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoginForm from './LoginForm';
import SignupForm from './SignupForm';
import '../App.css';

function Navbar() {
  const { user, logout } = useAuth();
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const navigate = useNavigate();

  const handleSwitch = (mode) => {
    if (mode === 'login') {
      setShowLogin(true);
      setShowSignup(false);
    } else {
      setShowSignup(true);
      setShowLogin(false);
    }
  };

  const handleSavedJobsClick = () => {
    const resumeName = localStorage.getItem('latestResumeName') || 'DefaultResume';
    navigate('/saved-jobs', { state: { resumeName } });
  };

  return (
    <>
      <nav className="navbar">
        <div className="navbar-brand">
          🎯 CareerCraft <span className="ai-highlight">AI</span>
        </div>

        <div className="navbar-links">
          <Link to="/">Home</Link>
          <Link to="/about">About Us</Link>
          <Link to="/contact">Contact</Link>

          {user && (
            <button onClick={handleSavedJobsClick} className="btn-saved-jobs">
              Saved Jobs
            </button>
          )}

          {user ? (
            <button className="nav-btn" onClick={logout}>Logout</button>
          ) : (
            <>
              <button className="nav-btn" onClick={() => handleSwitch('login')}>Login</button>
              <button className="nav-btn" onClick={() => handleSwitch('signup')}>Signup</button>
            </>
          )}
        </div>
      </nav>

      {/* Login/Signup Modals */}
      {showLogin && (
        <div className="auth-modal">
          <LoginForm onClose={() => setShowLogin(false)} onSwitch={() => handleSwitch('signup')} />
        </div>
      )}
      {showSignup && (
        <div className="auth-modal">
          <SignupForm onClose={() => setShowSignup(false)} onSwitch={() => handleSwitch('login')} />
        </div>
      )}
    </>
  );
}

export default Navbar;
