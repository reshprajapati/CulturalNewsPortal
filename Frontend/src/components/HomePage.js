import React, { useState, useEffect } from 'react';
import { postService, festivalService } from '../services';
import './HomePage.css';

function HomePage() {
  const [featuredPosts, setFeaturedPosts] = useState([]);
  const [featuredFestivals, setFeaturedFestivals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeaturedContent();
  }, []);

  const fetchFeaturedContent = async () => {
    try {
      const postsRes = await postService.getAllPosts('');
      const festivalsRes = await festivalService.getAllFestivals('');
      setFeaturedPosts(postsRes.data.slice(0, 3));
      setFeaturedFestivals(festivalsRes.data.slice(0, 3));
    } catch (error) {
      console.error('Error fetching content:', error);
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    { name: 'Dance', emoji: '💃', color: '#FF6B9D' },
    { name: 'Music', emoji: '🎵', color: '#667eea' },
    { name: 'Art', emoji: '🎨', color: '#764ba2' },
    { name: 'Food', emoji: '🍛', color: '#F59E0B' },
    { name: 'Heritage', emoji: '🏛️', color: '#8B4513' },
    { name: 'Sports', emoji: '⚽', color: '#10B981' }
  ];

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">🎭 Celebrate Culture</h1>
          <p className="hero-subtitle">Discover, Share & Celebrate the Rich Tapestry of Culture Around the World</p>
          <div className="hero-buttons">
            <a href="/create-post" className="btn-primary">Share a Story</a>
            <a href="/festivals" className="btn-secondary">Explore Festivals</a>
          </div>
        </div>
        <div className="hero-decorative">
          <div className="decoration-pattern"></div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="categories-section">
        <h2 className="section-title">Explore by Category</h2>
        <div className="categories-grid">
          {categories.map((cat) => (
            <a 
              key={cat.name} 
              href={`/?category=${cat.name}`}
              className="category-card"
              style={{ borderTopColor: cat.color }}
            >
              <div className="category-emoji">{cat.emoji}</div>
              <h3>{cat.name}</h3>
              <p>Discover {cat.name.toLowerCase()} content</p>
            </a>
          ))}
        </div>
      </section>

      {/* Featured Posts Section */}
      <section className="featured-section">
        <h2 className="section-title">✨ Featured Culture Stories</h2>
        {loading ? (
          <p className="loading">Loading featured posts...</p>
        ) : featuredPosts.length === 0 ? (
          <p className="no-content">No posts yet. Be the first to share!</p>
        ) : (
          <div className="featured-posts-grid">
            {featuredPosts.map((post) => (
              <div key={post._id} className="featured-post-card">
                {post.imageUrl && (
                  <div className="featured-image">
                    <img src={`http://localhost:5000${post.imageUrl}`} alt={post.title} />
                    <span className="category-tag">{post.category}</span>
                  </div>
                )}
                <div className="featured-content">
                  <h3>{post.title}</h3>
                  <p className="excerpt">{post.content.substring(0, 100)}...</p>
                  <div className="post-footer">
                    <span className="author">By {post.author.name}</span>
                    <span className="stats">❤️ {post.likes.length} • 👁️ {post.views}</span>
                  </div>
                  <a href={`/post/${post._id}`} className="read-more">Read Full Story →</a>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Featured Festivals Section */}
      <section className="featured-festivals-section">
        <h2 className="section-title">🎉 Upcoming Festivals & Events</h2>
        {loading ? (
          <p className="loading">Loading festivals...</p>
        ) : featuredFestivals.length === 0 ? (
          <p className="no-content">No festivals listed yet. Add one!</p>
        ) : (
          <div className="featured-festivals-grid">
            {featuredFestivals.map((festival) => (
              <div key={festival._id} className="featured-festival-card">
                {festival.imageUrl && (
                  <div className="festival-image">
                    <img src={`http://localhost:5000${festival.imageUrl}`} alt={festival.name} />
                  </div>
                )}
                <div className="festival-info">
                  <div className="festival-header">
                    <h3>{festival.name}</h3>
                    <span className="festival-type">{festival.festivalType}</span>
                  </div>
                  <p className="location">📍 {festival.location}</p>
                  <div className="festival-dates">
                    <span>📅 {new Date(festival.startDate).toLocaleDateString()}</span>
                    <span> - </span>
                    <span>{new Date(festival.endDate).toLocaleDateString()}</span>
                  </div>
                  <p className="description">{festival.description.substring(0, 80)}...</p>
                  <div className="festival-footer">
                    <span className="category-label">{festival.category}</span>
                    <span className="views">👁️ {festival.views}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Call to Action Section */}
      <section className="cta-section">
        <div className="cta-content">
          <h2>Join Our Cultural Community</h2>
          <p>Share your cultural stories, events, and traditions with thousands of culture enthusiasts</p>
          <div className="cta-buttons">
            <a href="/register" className="btn-cta-primary">Get Started</a>
            <a href="/festivals" className="btn-cta-secondary">Browse Festivals</a>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="stats-container">
          <div className="stat-item">
            <h3>📚</h3>
            <p className="stat-number">500+</p>
            <p className="stat-label">Culture Stories</p>
          </div>
          <div className="stat-item">
            <h3>🎊</h3>
            <p className="stat-number">200+</p>
            <p className="stat-label">Festivals Listed</p>
          </div>
          <div className="stat-item">
            <h3>👥</h3>
            <p className="stat-number">1000+</p>
            <p className="stat-label">Community Members</p>
          </div>
          <div className="stat-item">
            <h3>🌍</h3>
            <p className="stat-number">50+</p>
            <p className="stat-label">Countries</p>
          </div>
        </div>
      </section>

      {/* Footer Section */}
      <footer className="home-footer">
        <div className="footer-content">
          <div className="footer-section">
            <h4>About Us</h4>
            <p>Culture News Portal celebrates the rich diversity of global cultures through stories, festivals, and traditions.</p>
          </div>
          <div className="footer-section">
            <h4>Quick Links</h4>
            <ul>
              <li><a href="/">Home</a></li>
              <li><a href="/festivals">Festivals</a></li>
              <li><a href="/create-post">Share Story</a></li>
            </ul>
          </div>
          <div className="footer-section">
            <h4>Categories</h4>
            <ul>
              <li><a href="/?category=Dance">Dance</a></li>
              <li><a href="/?category=Music">Music</a></li>
              <li><a href="/?category=Art">Art</a></li>
              <li><a href="/?category=Food">Food</a></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2026 Culture News Portal. Celebrating Diversity Together. 🌍</p>
        </div>
      </footer>
    </div>
  );
}

export default HomePage;
