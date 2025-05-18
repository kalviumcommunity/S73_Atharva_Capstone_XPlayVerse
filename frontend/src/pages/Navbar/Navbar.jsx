import { Link } from 'react-router-dom';
import '../Navbar/Navbar.css';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <h2 className="navbar-title">XPlayVerse</h2>
        <div className="nav-links">
          <Link to="/">HOME</Link>
          <Link to="/leaderboard">LEADERBOARD</Link>
          <Link to="/login">LOGIN</Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
