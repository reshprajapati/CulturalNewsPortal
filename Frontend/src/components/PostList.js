import React, { useState, useEffect } from 'react';
import { postService } from '../services';
import './PostList.css';

function PostList() {
  const [posts, setPosts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const categories = ['Dance', 'Music', 'Art', 'Food', 'Literature', 'Heritage', 'Sports'];

  useEffect(() => {
    fetchPosts();
  }, [selectedCategory, search]);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const response = await postService.getAllPosts(selectedCategory, search);
      setPosts(response.data);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (postId) => {
    try {
      await postService.likePost(postId);
      fetchPosts();
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  return (
    <div className="post-list-container">
      <div className="filters">
        <input
          type="text"
          placeholder="Search posts..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <p>Loading posts...</p>
      ) : posts.length === 0 ? (
        <p>No posts found</p>
      ) : (
        <div className="posts-grid">
          {posts.map((post) => (
            <div key={post._id} className="post-card">
              {post.imageUrl && (
                <div className="post-image">
                  <img src={`http://localhost:5000${post.imageUrl}`} alt={post.title} />
                </div>
              )}
              <div className="post-content">
                <h3>{post.title}</h3>
                <p className="category">{post.category}</p>
                <p className="excerpt">{post.content.substring(0, 100)}...</p>
                <div className="post-meta">
                  <span>By {post.author.name}</span>
                  <span>{post.views} views</span>
                </div>
                <div className="post-actions">
                  <button onClick={() => handleLike(post._id)}>❤️ {post.likes.length}</button>
                  <a href={`/post/${post._id}`}>Read More</a>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default PostList;
