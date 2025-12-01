import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import './Login.css';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const Login = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post(
        `${BACKEND_URL}/api/users/login`,
        form,
        { withCredentials: true }
      );

      localStorage.setItem('userId', res.data.userId);
      alert('Login successful!');
      navigate('/feeds');
    } catch (err) {
      console.error(err);
      alert(err?.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = `${BACKEND_URL}/api/auth/google`;
  };

  return (
    <div className="login-container">

      <form className="login-form" onSubmit={handleSubmit}>
        <h2>Login</h2>

        <input
          type="email"
          name="email"
          placeholder="email@example.com"
          onChange={handleChange}
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          onChange={handleChange}
          required
        />

        <button type="submit" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>

        <div className="google-btn-container">
          <button
            type="button"
            className="google-btn"
            onClick={handleGoogleLogin}
          >
            <img
              src="https://developers.google.com/identity/images/g-logo.png"
              alt="Google Logo"
              className="google-icon"
            />
            Continue with Google
          </button>
        </div>

        <p>
          Don&apos;t have an account?{' '}
          <Link to="/signup">Signup</Link>
        </p>
      </form>

    </div>
  );
};

export default Login;
