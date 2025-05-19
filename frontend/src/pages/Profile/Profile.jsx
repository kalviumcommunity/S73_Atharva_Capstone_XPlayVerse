import { useEffect, useState } from 'react';
import axios from 'axios';
import '../Profile/Profile.css';
import Navbar from '../Navbar/Navbar';
import { useNavigate } from 'react-router-dom';

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

    axios.get(`http://localhost:3000/api/users/${userId}`)
      .then(res => {
        setUser(res.data);
        setForm({
          name: res.data.name,
          username: res.data.username,
          email: res.data.email,
        });
      })
      .catch(err => console.error(err));

    axios.get(`http://localhost:3000/api/users`)
      .then(res => setAllUsers(res.data))
      .catch(err => console.error(err));

    axios.get(`http://localhost:3000/api/posts/user/${userId}`)
      .then(res => setUserPosts(res.data))
      .catch(err => console.error(err));
  }, [userId]);

  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:3000/api/users/${userId}`);
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
      const res = await axios.put(`http://localhost:3000/api/users/${userId}`, form);
      setUser(res.data);
      alert('Profile updated successfully!');
      setIsEditing(false);
    } catch (err) {
      console.error(err);
      alert('Update failed');
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
                ? `http://localhost:3000/uploads/${user.profilePicture}`
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
      <div className="user-scroller-section">
        <h3>Other Users on the Website</h3>
        <div className="user-scroller">
          {allUsers.map(u => (
            <div key={u._id} className="user-tile">
              <p className="tile-name">{u.name}</p>
              <p className="tile-username">@{u.username}</p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Profile;
