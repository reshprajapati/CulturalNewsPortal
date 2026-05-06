import React, { useState, useEffect } from 'react';
import { festivalService } from '../services';
import './CreateFestival.css';

function CreateFestival() {
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    festivalType: 'Religious',
    location: '',
    startDate: '',
    endDate: '',
    category: 'Dance',
    traditions: '',
    image: null
  });
  const [preview, setPreview] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const categories = ['Dance', 'Music', 'Art', 'Food', 'Heritage', 'Sports'];
  const types = ['Religious', 'Seasonal', 'National', 'Regional', 'Cultural', 'Social'];

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
      formDataToSend.append('name', formData.name);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('festivalType', formData.festivalType);
      formDataToSend.append('location', formData.location);
      formDataToSend.append('startDate', formData.startDate);
      formDataToSend.append('endDate', formData.endDate);
      formDataToSend.append('category', formData.category);
      formDataToSend.append('traditions', formData.traditions);
      if (formData.image) {
        formDataToSend.append('image', formData.image);
      }

      await festivalService.createFestivalWithImage(formDataToSend);
      setSuccess('Festival created successfully!');
      setFormData({
        name: '',
        description: '',
        festivalType: 'Religious',
        location: '',
        startDate: '',
        endDate: '',
        category: 'Dance',
        traditions: '',
        image: null
      });
      setPreview('');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create festival');
    } finally {
      setLoading(false);
    }
  };

  // Check if user is admin
  if (!user) {
    return <div className="create-festival-container"><p>Loading...</p></div>;
  }

  if (user.role !== 'admin') {
    return (
      <div className="create-festival-container">
        <div className="create-festival-box">
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
    <div className="create-festival-container">
      <div className="create-festival-box">
        <h2>Add Festival or Event</h2>
        <p className="admin-badge">✅ Admin Access</p>
        {success && <p className="success">{success}</p>}
        {error && <p className="error">{error}</p>}
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Festival Name"
            value={formData.name}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="location"
            placeholder="Location"
            value={formData.location}
            onChange={handleChange}
            required
          />
          <select name="festivalType" value={formData.festivalType} onChange={handleChange}>
            {types.map((type) => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
          <select name="category" value={formData.category} onChange={handleChange}>
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
          <textarea
            name="description"
            placeholder="Festival Description"
            rows="5"
            value={formData.description}
            onChange={handleChange}
            required
          ></textarea>
          <input
            type="date"
            name="startDate"
            value={formData.startDate}
            onChange={handleChange}
            required
          />
          <input
            type="date"
            name="endDate"
            value={formData.endDate}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="traditions"
            placeholder="Traditions (comma separated)"
            value={formData.traditions}
            onChange={handleChange}
          />

          <div className="image-upload-section">
            <label htmlFor="festival-image">Upload Festival Image:</label>
            <input
              type="file"
              id="festival-image"
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
            {loading ? 'Creating...' : 'Create Festival'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default CreateFestival;
