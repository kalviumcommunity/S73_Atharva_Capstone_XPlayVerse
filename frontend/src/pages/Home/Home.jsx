import { Link } from 'react-router-dom';
import './Home.css';

const Home = () => {
  return (
    <>
      <div className="home-wrapper">
        <div className="home-container">
          <div className="home-header" style={{ zIndex: 2 }}>
            <h1>WELCOME TO <span>XPlayVerse</span></h1>
            <p className="home-tagline">
              Join XPlayVerse – the ultimate gaming platform where gamers unite, compete, and rise through the ranks.
              Discover trending games, join esports tournaments, and build your squad.
            </p>
          </div>

          <div className="home-buttons" style={{ zIndex: 2 }}>
            <Link to="/login" className="home-button home-primary">LOGIN</Link>
            <Link to="/signup" className="home-button home-secondary">SIGNUP</Link>
          </div>

          <div className="home-features" style={{ zIndex: 2 }}>
            <div className="feature-card">
              <h3>GameSync Profiles</h3>
              <p>One profile to manage all your games with zero hassle.</p>
            </div>
            <div className="feature-card">
              <h3>VerseLeader</h3>
              <p>Compete weekly and climb to the top of the leaderboards.</p>
            </div>
            <div className="feature-card">
              <h3>SquadVerse Rooms</h3>
              <p>Create your crew, your space, and play by your rules.</p>
            </div>
          </div>

          <div className="home-bg-animation"></div>
        </div>
      </div>
    </>
  );
};

export default Home;
