import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Signup.css';

const Signup = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match!');
      return;
    }

    const payload = {
      name: formData.name,
      username: formData.username,
      email: formData.email,
      password: formData.password,
      games: [],
      achievements: [],
      highScore: 0,
    };

    try {
      const res = await fetch('http://localhost:3000/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok) {
        alert('Signup successful! Please log in.');
        navigate('/login');
      } else {
        alert(data.message || 'Signup failed');
      }
    } catch (err) {
      alert('Something went wrong!');
      console.error(err);
    }
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
              <label className="game-input-label">NAME</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="game-input"
                placeholder="Enter your full name"
                required
              />
            </div>

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
            <p>
              ALREADY HAVE AN ACCOUNT?{' '}
              <Link to="/login" className="game-footer-link">LOGIN</Link>
            </p>
          </div>
        </div>
      </div>
      
      <div className="game-signup-bg-effects"></div>
    </div>
  );
};

export default Signup;
