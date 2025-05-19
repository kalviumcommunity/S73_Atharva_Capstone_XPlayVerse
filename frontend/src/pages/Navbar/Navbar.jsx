import { useNavigate, Link } from 'react-router-dom';
import '../Navbar/Navbar.css';

const Navbar = () => {
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem("userId");
    alert("Logout successfully");
    navigate("/");
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <h2 className="navbar-title">XPlayVerse</h2>
        <div className="nav-links">
          <Link to="/feeds">FEEDS</Link>
          <Link to="/leaderboard">LEADERBOARD</Link>
          <Link to="/profile">PROFILE</Link>
          <button onClick={handleLogout}>LOGOUT</button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
