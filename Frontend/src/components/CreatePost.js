import React, { useState, useEffect } from 'react';
import { postService } from '../services';
import './CreatePost.css';

function CreatePost() {
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: 'Dance',
    image: null
  });
  const [preview, setPreview] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const categories = ['Dance', 'Music', 'Art', 'Food', 'Literature', 'Heritage', 'Sports', 'Other'];

  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
    setUser(currentUser);
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, image: file });
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('title', formData.title);
      formDataToSend.append('content', formData.content);
      formDataToSend.append('category', formData.category);
      if (formData.image) {
        formDataToSend.append('image', formData.image);
      }

      await postService.createPostWithImage(formDataToSend);
      setSuccess('Post created successfully!');
      setFormData({ title: '', content: '', category: 'Dance', image: null });
      setPreview('');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create post');
    } finally {
      setLoading(false);
    }
  };

  // Check if user is admin
  if (!user) {
    return <div className="create-post-container"><p>Loading...</p></div>;
  }

  if (user.role !== 'admin') {
    return (
      <div className="create-post-container">
        <div className="create-post-box">
          <div className="unauthorized-message">
            <h2>⛔ Admin Access Required</h2>
            <p>Only administrators can create posts and festivals.</p>
            <p className="your-role">Your role: <strong>{user.role}</strong></p>
            <p className="description">As a user, you can:</p>
            <ul>
              <li>❤️ Like posts and festivals</li>
              <li>💬 Add comments and reviews</li>
              <li>⭐ Rate content</li>
              <li>🔍 Browse and search content</li>
            </ul>
            <a href="/" className="btn-back">← Back to Home</a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="create-post-container">
      <div className="create-post-box">
        <h2>Create Culture Post</h2>
        <p className="admin-badge">✅ Admin Access</p>
        {success && <p className="success">{success}</p>}
        {error && <p className="error">{error}</p>}
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="title"
            placeholder="Post Title"
            value={formData.title}
            onChange={handleChange}
            required
          />
          <select name="category" value={formData.category} onChange={handleChange}>
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
          <textarea
            name="content"
            placeholder="Write your post content..."
            rows="10"
            value={formData.content}
            onChange={handleChange}
            required
          ></textarea>
          
          <div className="image-upload-section">
            <label htmlFor="image">Upload Featured Image:</label>
            <input
              type="file"
              id="image"
              accept="image/*"
              onChange={handleImageChange}
            />
            {preview && (
              <div className="image-preview">
                <img src={preview} alt="Preview" />
              </div>
            )}
          </div>

          <button type="submit" disabled={loading}>
            {loading ? 'Publishing...' : 'Publish Post'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default CreatePost;
