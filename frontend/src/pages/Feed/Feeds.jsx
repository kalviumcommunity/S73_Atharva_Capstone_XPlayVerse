import { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '../Navbar/Navbar';
import './Feeds.css';

const Feeds = () => {
  const [posts, setPosts] = useState([]);
  const [caption, setCaption] = useState('');
  const [image, setImage] = useState(null);
  const [user, setUser] = useState(null);

  const userId = localStorage.getItem('userId');

  useEffect(() => {
    if (userId) {
      axios.get(`http://localhost:3000/api/users/${userId}`)
        .then(res => setUser(res.data))
        .catch(err => console.error(err));
    }

    fetchPosts();
  }, [userId]);

  const fetchPosts = async () => {
    try {
      const res = await axios.get('http://localhost:3000/api/posts');
      const sortedPosts = res.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setPosts(sortedPosts);
    } catch (err) {
      console.error(err);
    }
  };

  const handlePostSubmit = async (e) => {
    e.preventDefault();

    if (!caption && !image) return alert('Please add text or image');

    const formData = new FormData();
    formData.append('userId', userId);
    formData.append('caption', caption);
    if (image) formData.append('image', image);

    try {
      await axios.post('http://localhost:3000/api/posts', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setCaption('');
      setImage(null);
      fetchPosts();
    } catch (err) {
      console.error(err);
      alert('Failed to create post');
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
            <button type="submit">Post</button>
          </form>
        </div>

        <div className="posts-feed">
          <h2>All Posts</h2>
          {posts.map(post => (
            <div key={post._id} className="post-card">
              <div className="post-header">
                <img
                  src={`http://localhost:3000/uploads/${post.userId?.profilePicture}`}
                  alt="profile"
                  className="post-profile-pic"
                  onError={(e) => { e.target.src = 'https://via.placeholder.com/40' }}
                />
                <p className="post-username">@{post.userId?.username || 'Anonymous'}</p>
              </div>
              <div className="post-content">
                <p className="post-caption">{post.caption}</p>
                {post.image && (
                  <img
                    src={`http://localhost:3000/uploads/${post.image}`}
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
