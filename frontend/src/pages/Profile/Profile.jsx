import { useEffect, useState } from 'react';
import axios from 'axios';
import '../Profile/Profile.css';
import Navbar from '../Navbar/Navbar';
import { useNavigate } from 'react-router-dom';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const Profile = () => {
  const [user, setUser] = useState(null);
  const [form, setForm] = useState({ name: '', username: '', email: '' });
  const [isEditing, setIsEditing] = useState(false);
  const [userPosts, setUserPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const storedUserId = localStorage.getItem('userId');

  useEffect(() => {
    let mounted = true;

    const fetchCurrentUser = async () => {
      try {
        const res = await axios.get(`${BACKEND_URL}/api/me`, { withCredentials: true });
        if (!mounted) return;

        const currentUser = res.data.user || res.data;
        setUser(currentUser);
        localStorage.setItem('userId', currentUser._id);

        setForm({
          name: currentUser.name || '',
          username: currentUser.username || '',
          email: currentUser.email || '',
        });

        fetchUserPosts(currentUser._id);
      } catch (err) {
        if (storedUserId) fetchByIdFallback(storedUserId);
        else navigate('/login');
      } finally {
        if (mounted) setLoading(false);
      }
    };

    const fetchByIdFallback = async (id) => {
      try {
        const [userRes, postsRes] = await Promise.all([
          axios.get(`${BACKEND_URL}/api/users/${id}`, { withCredentials: true }),
          axios.get(`${BACKEND_URL}/api/posts/user/${id}`, { withCredentials: true }),
        ]);
        if (!mounted) return;

        setUser(userRes.data);
        setForm({
          name: userRes.data.name || '',
          username: userRes.data.username || '',
          email: userRes.data.email || '',
        });
        setUserPosts(postsRes.data || []);
      } catch {
        navigate('/login');
      } finally {
        if (mounted) setLoading(false);
      }
    };

    const fetchUserPosts = async (uid) => {
      try {
        const res = await axios.get(`${BACKEND_URL}/api/posts/user/${uid}`, { withCredentials: true });
        if (mounted) setUserPosts(res.data || []);
      } catch {}
    };

    fetchCurrentUser();
    return () => { mounted = false; };
  }, []);

  const handleDelete = async () => {
    try {
      const id = user?._id || storedUserId;
      if (!id) return;

      await axios.delete(`${BACKEND_URL}/api/users/${id}`, { withCredentials: true });
      localStorage.removeItem('userId');
      navigate('/signup');
    } catch {
      alert('Failed to delete account');
    }
  };

  const handleUpdate = async () => {
    try {
      const id = user?._id || storedUserId;
      if (!id) return;

      const res = await axios.put(`${BACKEND_URL}/api/users/${id}`, form, { withCredentials: true });
      setUser(res.data);
      setIsEditing(false);
      alert('Profile updated');
    } catch {
      alert('Update failed');
    }
  };

  const handleDeletePost = async (postId) => {
    try {
      await axios.delete(`${BACKEND_URL}/api/posts/${postId}`, { withCredentials: true });
      setUserPosts(prev => prev.filter(p => p._id !== postId));
    } catch {
      alert('Failed to delete post');
    }
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  if (loading) return <div className="profile-container"><p className="loading">Loading...</p></div>;
  if (!user) return <div className="profile-container"><p className="loading">Please login first</p></div>;

  return (
    <>
      <Navbar />

      <div className="profile-container">
        <div className="profile-card">

          <h2 className="profile-title">
            User Profile
            {user.isVerified && <span className="profile-title-badge">✔</span>}
          </h2>

          <img
            src={user.profilePicture || 'https://avatar.iran.liara.run/public'}
            alt="Profile"
            className="profile-picture"
          />

          <div className="verification-section">
            {user.isVerified ? (
              <span className="verified-badge-inline">✔ Verified Account</span>
            ) : (
              <button
                className="verify-btn-inline"
                onClick={() => navigate('/verify')}
              >
                Get Verified
              </button>
            )}
          </div>

          {isEditing ? (
            <>
              <input type="text" name="name" value={form.name} onChange={handleChange} />
              <input type="text" name="username" value={form.username} onChange={handleChange} />
              <input type="email" name="email" value={form.email} onChange={handleChange} />
              <button className="save-btn" onClick={handleUpdate}>Save</button>
              <button className="cancel-btn" onClick={() => setIsEditing(false)}>Cancel</button>
            </>
          ) : (
            <>
              <p><strong>Name:</strong> {user.name}</p>
              <p><strong>Username:</strong> {user.username}</p>
              <p><strong>Email:</strong> {user.email}</p>
              <button className="edit-btn" onClick={() => setIsEditing(true)}>Edit</button>
              <button className="delete-btn" onClick={handleDelete}>Delete</button>
            </>
          )}
        </div>
      </div>

      <div className="profile-posts-section">
        <h2 className="profile-posts-title">Your Posts</h2>

        {userPosts.length ? (
          <div className="profile-posts-grid">
            {userPosts.map(post => (
              <div key={post._id} className="profile-post-card">
                <div className="profile-post-user">
                  <img
                    src={post.userId?.profilePicture}
                    className="profile-user-image"
                    alt=""
                    onError={(e) => e.target.src = 'https://avatar.iran.liara.run/public'}
                  />
                  <p className="profile-username">@{post.userId?.username}</p>
                  <button className="profile-post-delete-btn" onClick={() => handleDeletePost(post._id)}>✕</button>
                </div>

                <p className="profile-post-caption">{post.caption}</p>

                {post.image && (
                  <img src={post.image} alt="" className="profile-post-image" />
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="profile-no-posts">No posts found</p>
        )}
      </div>
    </>
  );
};

export default Profile;
