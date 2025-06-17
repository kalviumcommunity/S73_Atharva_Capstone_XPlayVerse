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
  const navigate = useNavigate();

  const userId = localStorage.getItem('userId');

  useEffect(() => {
    if (!userId) return;

    axios.get(`${BACKEND_URL}/api/users/${userId}`)
      .then(res => {
        setUser(res.data);
        setForm({
          name: res.data.name,
          username: res.data.username,
          email: res.data.email,
        });
      })
      .catch(err => console.error(err));

    axios.get(`${BACKEND_URL}/api/users`)
      .then(res => setAllUsers(res.data))
      .catch(err => console.error(err));

    axios.get(`${BACKEND_URL}/api/posts/user/${userId}`)
      .then(res => setUserPosts(res.data))
      .catch(err => console.error(err));
  }, [userId]);

  const handleDelete = async () => {
    try {
      await axios.delete(`${BACKEND_URL}/api/users/${userId}`);
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
      const res = await axios.put(`${BACKEND_URL}/api/users/${userId}`, form);
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
      await axios.delete(`${BACKEND_URL}/api/posts/${postId}`);
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

  if (!user) return <div className="profile-container"><p className="loading">Please Login First.</p></div>;

  return (
    <>
      <Navbar />
      <div className="profile-container">
        <div className="profile-card">
          <h2>User Profile</h2>
          <img src={
              user.profilePicture
                ? `${BACKEND_URL}/uploads/${user.profilePicture}`
                : 'https://via.placeholder.com/100'
            }
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
                    src={`${BACKEND_URL}/uploads/${post.userId?.profilePicture}`}
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
                    src={`${BACKEND_URL}/uploads/${post.image}`}
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
      <div className="user-scroller-section">
        <h3>Other Users on the Website</h3>
        <div className="user-scroller">
          {allUsers.map(u => (
            <div key={u._id} className="user-tile">
              <img
                src={u.profilePicture ? `${BACKEND_URL}/uploads/${u.profilePicture}` : 'https://via.placeholder.com/40'}
                alt="profile"
                className="tile-profile-pic"
              />
              <div>
                <p className="tile-name">{u.name}</p>
                <p className="tile-username">@{u.username}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Profile;
