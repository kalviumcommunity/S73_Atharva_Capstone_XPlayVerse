import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import './Signup.css';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const Signup = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [profilePicture, setProfilePicture] = useState(null);
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState('FORM');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setProfilePicture(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      if (key !== 'confirmPassword') {
        formData.append(key, value);
      }
    });
    if (profilePicture) formData.append('profilePicture', profilePicture);

    try {
      setLoading(true);
      await axios.post(
        `${BACKEND_URL}/api/users/signup`,
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );

      alert('OTP sent to your email');
      setStep('OTP');
    } catch (err) {
      console.error(err);
      alert(err?.response?.data?.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async () => {
    if (!otp) {
      alert('Please enter OTP');
      return;
    }

    try {
      setLoading(true);
      await axios.post(`${BACKEND_URL}/api/users/signup/verify-otp`, {
        email: form.email,
        otp
      });

      alert('Signup successful! Please login.');
      navigate('/login');
    } catch (err) {
      console.error(err);
      alert(err?.response?.data?.message || 'OTP verification failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-container">
      <form className="signup-form" onSubmit={handleSubmit}>
        <h2>Create Account</h2>

        {step === 'FORM' && (
          <>
            <input
              type="text"
              name="name"
              placeholder="Enter your full name"
              value={form.name}
              onChange={handleChange}
              required
            />

            <input
              type="text"
              name="username"
              placeholder="Choose your username"
              value={form.username}
              onChange={handleChange}
              required
            />

            <input
              type="email"
              name="email"
              placeholder="your@email.com"
              value={form.email}
              onChange={handleChange}
              required
            />

            <input
              type="password"
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              required
            />

            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              value={form.confirmPassword}
              onChange={handleChange}
              required
            />

            <label htmlFor="profilePicture" className="file-label">
              Upload Profile Picture
            </label>
            <input
              type="file"
              name="profilePicture"
              accept="image/*"
              onChange={handleFileChange}
            />

            <button type="submit" disabled={loading}>
              {loading ? 'Sending OTP...' : 'Begin Journey'}
            </button>

            <p>
              Already have an account? <Link to="/login">Login</Link>
            </p>
          </>
        )}

        {step === 'OTP' && (
          <>
            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
            />

            <button type="button" onClick={verifyOtp} disabled={loading}>
              {loading ? 'Verifying...' : 'Verify OTP'}
            </button>
          </>
        )}
      </form>
    </div>
  );
};

export default Signup;
