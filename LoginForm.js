import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import './LoginForm.css';

function LoginForm({ onClose }) {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();

    const success = await login({ email, password });
    if (success) {
      onClose();
    } else {
      alert('Invalid email or password. Please try again.');
    }
  };

  return (
    <div className="login-modal-overlay">
      <div className="login-modal-content">
        <button className="login-close-btn" onClick={onClose}>×</button>
        <h2>Login</h2>
        <form onSubmit={handleLogin} className="login-form">
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

          <button type="submit">Login</button>
        </form>
      </div>
    </div>
  );
}

export default LoginForm;