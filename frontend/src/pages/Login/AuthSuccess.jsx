import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const AuthSuccess = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        // If the backend attached the JWT in the query string (redirect), use it.
        const params = new URLSearchParams(window.location.search);
        const token = params.get('token');

        // When token is present use it in query (authMiddleware accepts query token),
        // otherwise attempt cookie-based auth
        const url = token ? `${BACKEND_URL}/api/me?token=${encodeURIComponent(token)}` : `${BACKEND_URL}/api/me`;
        const opts = token ? { method: 'GET' } : { method: 'GET', credentials: 'include' };

        const res = await fetch(url, opts);

        if (!res.ok) {
          throw new Error('Failed to fetch user');
        }

        const data = await res.json();
        localStorage.setItem('user', JSON.stringify(data.user));
        if (data.user && data.user._id) localStorage.setItem('userId', data.user._id);

        navigate('/feeds');
      } catch (err) {
        console.error(err);
        navigate('/login');
      }
    };

    fetchUser();
  }, [navigate]);

  return <div>Completing login...</div>;
};

export default AuthSuccess;
