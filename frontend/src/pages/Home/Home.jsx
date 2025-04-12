import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

const Home = () => {
  return (
    <div className="game-home-container">
      <div className="game-home-content">
        <div className="game-home-header">
          <h1>WELCOME TO <span>XPlayVerse</span></h1>
          <p className="game-home-tagline">Where Gamers Connect, Compete, and Climb the Ranks Together.</p>
        </div>
        
        <div className="game-home-buttons">
          <Link to="/login" className="game-home-button game-home-primary">
            LOGIN
          </Link>
          <Link to="/signup" className="game-home-button game-home-secondary">
            SIGNUP
          </Link>
        </div>
        
        <div className="game-home-features">
          <div className="game-feature-card">
            <h3>GameSync Profiles</h3>
            <p>One profile. All your games. Zero hassle.</p>
          </div>
          <div className="game-feature-card">
            <h3>VerseLeader</h3>
            <p>Compete. Climb. Conquer every week.</p>
          </div>
          <div className="game-feature-card">
            <h3>SquadVerse Rooms</h3>
            <p>Your crew. Your space. Your rules.</p>
          </div>
        </div>
      </div>
      
      <div className="game-home-bg-animation"></div>
    </div>
  );
};

export default Home;