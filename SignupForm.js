import React, { useState } from 'react';
import './SignupForm.css';
import { useAuth } from '../context/AuthContext';

function SignupForm({ onClose }) {
  const { signup } = useAuth();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignup = async (e) => {
    e.preventDefault();
    const success = await signup({ username, email, password });

    // ✅ Only close the modal if signup was successful
    if (success) {
      onClose();
    }
    // ❌ Do not close the modal or show extra alerts on failure
  };

  return (
    <div className="signup-modal-overlay">
      <div className="signup-modal-content">
        <button className="signup-close-btn" onClick={onClose}>×</button>
        <h2>Sign Up</h2>
        <form onSubmit={handleSignup} className="signup-form">
          <label>Username</label>
          <input
            type="text"
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <label>Email</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <label>Password</label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button type="submit">Create Account</button>
        </form>
      </div>
    </div>
  );
}

export default SignupForm;