import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import "./Login.css";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const Login = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [rateLimited, setRateLimited] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    if (cooldown > 0) {
      const timer = setInterval(() => {
        setCooldown((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [cooldown]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rateLimited) return;

    setLoading(true);
    try {
      const res = await axios.post(
        `${BACKEND_URL}/api/users/login`,
        form,
        { withCredentials: true }
      );

      localStorage.setItem("userId", res.data.userId);
      alert("Login successful!");
      navigate("/feeds");
    } catch (err) {
      const status = err?.response?.status;

      if (status === 429) {
        setRateLimited(true);
        setCooldown(300);
        alert("Too many login attempts. Please wait 5 minutes.");
      } else {
        alert(err?.response?.data?.message || "Login failed");
      }
    } finally {
      setLoading(false);
    }
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

        <button type="submit" disabled={loading || rateLimited}>
          {loading
            ? "Logging in..."
            : rateLimited
            ? `Try again in ${cooldown}s`
            : "Login"}
        </button>

        {rateLimited && (
          <p className="rate-limit-warning">
            Too many login attempts. Please wait before trying again.
          </p>
        )}

        <div className="google-btn-container">
          <button
            type="button"
            className="google-login-btn"
            onClick={() =>
              (window.location.href = `${BACKEND_URL}/api/auth/google`)
            }
          >
            <img
              src="g-logo.png"
              alt="Google Logo"
              className="google-login-icon"
            />
            <span className="google-login-text">Sign in with Google</span>
          </button>
        </div>

        <p>
          Don&apos;t have an account? <Link to="/signup">Signup</Link>
        </p>
      </form>
    </div>
  );
};

export default Login;
