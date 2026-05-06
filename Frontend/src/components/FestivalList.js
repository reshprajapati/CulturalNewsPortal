import React, { useState, useEffect } from 'react';
import { festivalService } from '../services';
import './FestivalList.css';

function FestivalList() {
  const [festivals, setFestivals] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [loading, setLoading] = useState(true);

  const categories = ['Dance', 'Music', 'Art', 'Food', 'Heritage', 'Sports'];
  const types = ['Religious', 'Seasonal', 'National', 'Regional', 'Cultural', 'Social'];

  useEffect(() => {
    fetchFestivals();
  }, [selectedCategory, selectedType]);

  const fetchFestivals = async () => {
    setLoading(true);
    try {
      const response = await festivalService.getAllFestivals(selectedCategory, selectedType);
      setFestivals(response.data);
    } catch (error) {
      console.error('Error fetching festivals:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="festival-list-container">
      <h2>Festivals & Events</h2>
      <div className="filters">
        <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
        <select value={selectedType} onChange={(e) => setSelectedType(e.target.value)}>
          <option value="">All Types</option>
          {types.map((type) => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <p>Loading festivals...</p>
      ) : festivals.length === 0 ? (
        <p>No festivals found</p>
      ) : (
        <div className="festivals-grid">
          {festivals.map((festival) => (
            <div key={festival._id} className="festival-card">
              {festival.imageUrl && (
                <div className="festival-image">
                  <img src={`http://localhost:5000${festival.imageUrl}`} alt={festival.name} />
                </div>
              )}
              <div className="festival-content">
                <h3>{festival.name}</h3>
                <p className="type">{festival.festivalType}</p>
                <p className="location">📍 {festival.location}</p>
                <p className="description">{festival.description.substring(0, 100)}...</p>
                <div className="festival-dates">
                  <span>{new Date(festival.startDate).toLocaleDateString()}</span>
                  <span>-</span>
                  <span>{new Date(festival.endDate).toLocaleDateString()}</span>
                </div>
                <div className="festival-meta">
                  <span>{festival.category}</span>
                  <span>{festival.views} views</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default FestivalList;
