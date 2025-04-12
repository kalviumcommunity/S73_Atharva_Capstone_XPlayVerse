import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  return (
    <nav className="game-navbar">
      <div className="game-navbar-container">
        <Link to="/" className="game-navbar-logo">
          <span className="game-logo-highlight">XPlay</span>Verse
        </Link>
        
        <div className="game-navbar-links">
          <Link to="/" className="game-nav-link">
            HOME
          </Link>
          <Link to="/signup" className="game-nav-link game-nav-cta">
            GET STARTED
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;