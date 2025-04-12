import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Signup.css';

const Signup = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Signup submitted:', formData);
  };

  return (
    <div className="game-signup-screen">
      <div className="game-signup-container">
        <div className="game-signup-card">
          <div className="game-signup-header">
            <h2>CREATE ACCOUNT</h2>
            <div className="game-signup-divider"></div>
            <p className="game-signup-subtitle">JOIN THE COMMUNITY</p>
          </div>
          
          <form onSubmit={handleSubmit} className="game-signup-form">
            <div className="game-input-group">
              <label className="game-input-label">GAMERTAG</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="game-input"
                placeholder="Choose your gamertag"
                required
              />
            </div>
            
            <div className="game-input-group">
              <label className="game-input-label">EMAIL</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="game-input"
                placeholder="your@email.com"
                required
              />
            </div>
            
            <div className="game-input-group">
              <label className="game-input-label">PASSWORD</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="game-input"
                placeholder="••••••••"
                required
              />
            </div>
            
            <div className="game-input-group">
              <label className="game-input-label">CONFIRM PASSWORD</label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="game-input"
                placeholder="••••••••"
                required
              />
            </div>
            
            <button type="submit" className="game-signup-button">
              BEGIN JOURNEY
            </button>
          </form>
          
          <div className="game-signup-footer">
            <p>ALREADY HAVE AN ACCOUNT? <Link to="/login" className="game-footer-link">LOGIN</Link></p>
          </div>
        </div>
      </div>
      
      <div className="game-signup-bg-effects"></div>
    </div>
  );
};

export default Signup;