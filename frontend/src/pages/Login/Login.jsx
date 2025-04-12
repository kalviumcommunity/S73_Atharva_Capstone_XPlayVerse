import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Login.css';

const Login = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
  
    try {
      const response = await fetch("http://localhost:3000/api/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: formData.username,
          password: formData.password,
        }),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        alert("Login successful! Welcome back, " + data.user.name);
        console.log("Login successful:", data);
        navigate("/");
      } else {
        alert(data.message || "Login failed");
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("Something went wrong. Try again.");
    } finally {
      setIsLoading(false);
    }
  };
  
  

  return (
    <div className="game-login-screen">
      <div className="game-login-container">
        <div className="game-login-card">
          <div className="game-login-header">
            <h2>PLAYER LOGIN</h2>
            <div className="game-login-divider"></div>
          </div>
          
          <form onSubmit={handleSubmit} className="game-login-form">
            <div className="game-input-group">
              <label className="game-input-label">USERNAME</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="game-input"
                placeholder="Enter your gamertag"
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
            
            <button 
              type="submit" 
              className="game-login-button"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="game-loading-spinner"></span>
              ) : (
                'START GAME'
              )}
            </button>
          </form>
          
          <div className="game-login-footer">
            <p>NEW PLAYER? <Link to="/signup" className="game-footer-link">CREATE ACCOUNT</Link></p>
            <Link to="/forgot-password" className="game-footer-link">FORGOT PASSWORD?</Link>
          </div>
        </div>
      </div>
      
      <div className="game-login-bg-particles"></div>
    </div>
  );
};

export default Login;