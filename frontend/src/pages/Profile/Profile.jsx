// src/pages/Profile/Profile.jsx
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
  const [allUsers, setAllUsers] = useState([]);
  const [userPosts, setUserPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // try to use cookie-authenticated endpoint first, fallback to localStorage
  const storedUserId = localStorage.getItem('userId');

  useEffect(() => {
    let mounted = true;

    const fetchCurrentUser = async () => {
      try {
        // Request current user using HttpOnly cookie (must include credentials)
        const res = await axios.get(`${BACKEND_URL}/api/me`, { withCredentials: true });

        if (!mounted) return;
        const currentUser = res.data.user || res.data; // accommodate variations
        setUser(currentUser);
        localStorage.setItem('userId', currentUser._id); // keep backwards compatibility
        setForm({
          name: currentUser.name || '',
          username: currentUser.username || '',
          email: currentUser.email || '',
        });

        // fetch user posts and all users in parallel
        fetchUserPosts(currentUser._id);
        fetchAllUsers();

      } catch (err) {
        // If cookie auth fails, fallback to localStorage userId if present
        if (storedUserId) {
          fetchByIdFallback(storedUserId);
        } else {
          console.warn('Not authenticated (no cookie). Redirecting to login.');
          navigate('/login');
        }
      } finally {
        if (mounted) setLoading(false);
      }
    };

    const fetchByIdFallback = async (id) => {
      try {
        const [userRes, allUsersRes, postsRes] = await Promise.all([
          axios.get(`${BACKEND_URL}/api/users/${id}`, { withCredentials: true }),
          axios.get(`${BACKEND_URL}/api/users`, { withCredentials: true }),
          axios.get(`${BACKEND_URL}/api/posts/user/${id}`, { withCredentials: true })
        ]);
        if (!mounted) return;
        const currentUser = userRes.data;
        setUser(currentUser);
        setForm({
          name: currentUser.name || '',
          username: currentUser.username || '',
          email: currentUser.email || '',
        });
        setAllUsers(allUsersRes.data || []);
        setUserPosts(postsRes.data || []);
      } catch (err) {
        console.error('Fallback fetch failed:', err);
        navigate('/login');
      } finally {
        if (mounted) setLoading(false);
      }
    };

    const fetchUserPosts = async (uid) => {
      try {
        const res = await axios.get(`${BACKEND_URL}/api/posts/user/${uid}`, { withCredentials: true });
        if (!mounted) return;
        setUserPosts(res.data || []);
      } catch (err) {
        console.error('Failed to fetch user posts:', err);
      }
    };

    const fetchAllUsers = async () => {
      try {
        const res = await axios.get(`${BACKEND_URL}/api/users`, { withCredentials: true });
        if (!mounted) return;
        setAllUsers(res.data || []);
      } catch (err) {
        console.error('Failed to fetch all users:', err);
      }
    };

    fetchCurrentUser();

    return () => { mounted = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // run only once on mount

  const handleDelete = async () => {
    try {
      const id = user?._id || localStorage.getItem('userId');
      if (!id) {
        alert('No user to delete');
        return;
      }
      await axios.delete(`${BACKEND_URL}/api/users/${id}`, { withCredentials: true });
      localStorage.removeItem('userId');
      alert('Account deleted');
      navigate('/signup');
    } catch (err) {
      console.error(err);
      alert('Failed to delete account');
    }
  };

  const handleUpdate = async () => {
    try {
      const id = user?._id || localStorage.getItem('userId');
      if (!id) {
        alert('No user to update');
        return;
      }
      const res = await axios.put(`${BACKEND_URL}/api/users/${id}`, form, { withCredentials: true });
      setUser(res.data);
      alert('Profile updated successfully!');
      setIsEditing(false);
    } catch (err) {
      console.error(err);
      alert('Update failed');
    }
  };

  const handleDeletePost = async (postId) => {
    try {
      await axios.delete(`${BACKEND_URL}/api/posts/${postId}`, { withCredentials: true });
      setUserPosts(prevPosts => prevPosts.filter(post => post._id !== postId));
      alert('Post deleted successfully');
    } catch (err) {
      console.error('Failed to delete post:', err);
      alert('Failed to delete post. Please try again.');
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  if (loading) return <div className="profile-container"><p className="loading">Loading...</p></div>;
  if (!user) return <div className="profile-container"><p className="loading">Please Login First.</p></div>;

  return (
    <>
      <Navbar />
      <div className="profile-container">
        <div className="profile-card">
          <h2>User Profile</h2>
          <img
            src={user.profilePicture || 'https://avatar.iran.liara.run/public'}
            alt="Profile"
            className="profile-picture"
          />
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
        {userPosts.length > 0 ? (
          <div className="profile-posts-grid">
            {userPosts.map(post => (
              <div key={post._id} className="profile-post-card">
                <div className="profile-post-user">
                  <img
                    src={post.userId?.profilePicture}
                    alt="profile"
                    className="profile-user-image"
                    onError={(e) => { e.target.src = 'https://via.placeholder.com/40' }}
                  />
                  <p className="profile-username">@{post.userId?.username || 'Anonymous'}</p>
                  <button className="profile-post-delete-btn" onClick={() => handleDeletePost(post._id)} title="Delete Post">
                    ✕
                  </button>
                </div>
                <p className="profile-post-caption">{post.caption}</p>
                {post.image && (
                  <img
                    src={post.image}
                    alt="Post"
                    className="profile-post-image"
                  />
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="profile-no-posts">No posts found.</p>
        )}
      </div>
    </>
  );
};

export default Profile;
