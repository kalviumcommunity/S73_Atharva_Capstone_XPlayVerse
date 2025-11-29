import { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '../Navbar/Navbar';
import './Feeds.css';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const Feeds = () => {
  const [posts, setPosts] = useState([]);
  const [caption, setCaption] = useState('');
  const [image, setImage] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false); 

  const userId = localStorage.getItem('userId');

  useEffect(() => {
    if (userId) {
      axios.get(`${BACKEND_URL}/api/users/${userId}`, { withCredentials: true })
        .then(res => setUser(res.data))
        .catch(err => console.error(err));
    }

    fetchPosts();
  }, [userId]);

  const fetchPosts = async () => {
    try {
      const res = await axios.get(`${BACKEND_URL}/api/posts`, { withCredentials: true });
      const sortedPosts = res.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setPosts(sortedPosts);
    } catch (err) {
      console.error(err);
    }
  };

  const handlePostSubmit = async (e) => {
    e.preventDefault();

    if (!caption && !image) return alert('Please add text or image');

    setLoading(true);

    const formData = new FormData();
    formData.append('userId', userId);
    formData.append('caption', caption);
    if (image) formData.append('image', image);

    try {
      await axios.post(`${BACKEND_URL}/api/posts`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }, 
        withCredentials: true
      });
      setCaption('');
      setImage(null);
      fetchPosts();
    } catch (err) {
      console.error(err);
      alert('Failed to create post');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="feeds-container">
        <div className="post-creator">
          <h2>Create a Post</h2>
          <form onSubmit={handlePostSubmit} encType="multipart/form-data">
            <textarea
              placeholder="What's on your mind?"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
            />
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImage(e.target.files[0])}
            />
            <button type="submit" disabled={loading}>
              {loading ? 'Posting...' : 'Post'}
            </button>
          </form>
        </div>

        <div className="posts-feed">
          <h2>All Posts</h2>
          {posts.map(post => (
            <div key={post._id} className="post-card">
              <div className="post-header">
                <img
                  src={post.userId?.profilePicture || "https://avatar.iran.liara.run/public"}
                  alt="profile"
                  className="post-profile-pic"
                  onError={(e) => { e.target.src = 'https://avatar.iran.liara.run/public' }}
                />
                <p className="post-username">@{post.userId?.username || 'Anonymous'}</p>
              </div>
              <div className="post-content">
                <p className="post-caption">{post.caption}</p>
                {post.image && (
                  <img
                    src={post.image}
                    alt="post"
                    className="post-image"
                  />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Feeds;
