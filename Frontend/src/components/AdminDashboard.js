import React, { useState, useEffect } from 'react';
import './AdminDashboard.css';

function AdminDashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalPosts: 0,
    totalFestivals: 0,
    draftPosts: 0
  });
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/admin/stats', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-container">
      <div className="admin-header">
        <h1>🛡️ Admin Dashboard</h1>
      </div>

      <div className="admin-tabs">
        <button 
          className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </button>
        <button 
          className={`tab-btn ${activeTab === 'users' ? 'active' : ''}`}
          onClick={() => setActiveTab('users')}
        >
          Users
        </button>
        <button 
          className={`tab-btn ${activeTab === 'posts' ? 'active' : ''}`}
          onClick={() => setActiveTab('posts')}
        >
          Posts
        </button>
        <button 
          className={`tab-btn ${activeTab === 'festivals' ? 'active' : ''}`}
          onClick={() => setActiveTab('festivals')}
        >
          Festivals
        </button>
      </div>

      <div className="admin-content">
        {activeTab === 'overview' && (
          <div className="overview-section">
            <h2>Dashboard Overview</h2>
            {loading ? (
              <p>Loading statistics...</p>
            ) : (
              <div className="stats-grid">
                <div className="stat-card">
                  <h3>Total Users</h3>
                  <p className="stat-number">{stats.totalUsers}</p>
                </div>
                <div className="stat-card">
                  <h3>Total Posts</h3>
                  <p className="stat-number">{stats.totalPosts}</p>
                </div>
                <div className="stat-card">
                  <h3>Draft Posts</h3>
                  <p className="stat-number">{stats.draftPosts}</p>
                </div>
                <div className="stat-card">
                  <h3>Total Festivals</h3>
                  <p className="stat-number">{stats.totalFestivals}</p>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'users' && <AdminUsers />}
        {activeTab === 'posts' && <AdminPosts />}
        {activeTab === 'festivals' && <AdminFestivals />}
      </div>
    </div>
  );
}

function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/admin/users', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        const token = localStorage.getItem('token');
        await fetch(`http://localhost:5000/api/admin/users/${userId}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` }
        });
        fetchUsers();
      } catch (error) {
        console.error('Error deleting user:', error);
      }
    }
  };

  const handleMakeAdmin = async (userId) => {
    if (window.confirm('Make this user an admin?')) {
      try {
        const token = localStorage.getItem('token');
        await fetch(`http://localhost:5000/api/admin/users/${userId}/make-admin`, {
          method: 'PUT',
          headers: { 'Authorization': `Bearer ${token}` }
        });
        fetchUsers();
      } catch (error) {
        console.error('Error making admin:', error);
      }
    }
  };

  return (
    <div className="admin-section">
      <h2>Manage Users</h2>
      {loading ? (
        <p>Loading users...</p>
      ) : (
        <div className="table-responsive">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Joined</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>
                    <span className={`role-badge ${user.role}`}>
                      {user.role}
                    </span>
                  </td>
                  <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                  <td className="actions">
                    {user.role !== 'admin' && (
                      <button 
                        className="btn-small btn-admin"
                        onClick={() => handleMakeAdmin(user._id)}
                      >
                        Make Admin
                      </button>
                    )}
                    <button 
                      className="btn-small btn-delete"
                      onClick={() => handleDeleteUser(user._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function AdminPosts() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/posts');
      const data = await response.json();
      setPosts(data);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePost = async (postId) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        const token = localStorage.getItem('token');
        await fetch(`http://localhost:5000/api/posts/${postId}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` }
        });
        fetchPosts();
      } catch (error) {
        console.error('Error deleting post:', error);
      }
    }
  };

  return (
    <div className="admin-section">
      <h2>Manage Posts</h2>
      {loading ? (
        <p>Loading posts...</p>
      ) : (
        <div className="table-responsive">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Author</th>
                <th>Category</th>
                <th>Views</th>
                <th>Status</th>
                <th>Created</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {posts.map((post) => (
                <tr key={post._id}>
                  <td>{post.title}</td>
                  <td>{post.author.name}</td>
                  <td>{post.category}</td>
                  <td>{post.views}</td>
                  <td>
                    <span className={`status-badge ${post.status}`}>
                      {post.status}
                    </span>
                  </td>
                  <td>{new Date(post.createdAt).toLocaleDateString()}</td>
                  <td className="actions">
                    <button 
                      className="btn-small btn-delete"
                      onClick={() => handleDeletePost(post._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function AdminFestivals() {
  const [festivals, setFestivals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFestivals();
  }, []);

  const fetchFestivals = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/festivals');
      const data = await response.json();
      setFestivals(data);
    } catch (error) {
      console.error('Error fetching festivals:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteFestival = async (festivalId) => {
    if (window.confirm('Are you sure you want to delete this festival?')) {
      try {
        const token = localStorage.getItem('token');
        await fetch(`http://localhost:5000/api/festivals/${festivalId}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` }
        });
        fetchFestivals();
      } catch (error) {
        console.error('Error deleting festival:', error);
      }
    }
  };

  return (
    <div className="admin-section">
      <h2>Manage Festivals</h2>
      {loading ? (
        <p>Loading festivals...</p>
      ) : (
        <div className="table-responsive">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Type</th>
                <th>Location</th>
                <th>Category</th>
                <th>Views</th>
                <th>Created By</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {festivals.map((festival) => (
                <tr key={festival._id}>
                  <td>{festival.name}</td>
                  <td>{festival.festivalType}</td>
                  <td>{festival.location}</td>
                  <td>{festival.category}</td>
                  <td>{festival.views}</td>
                  <td>{festival.createdBy.name}</td>
                  <td className="actions">
                    <button 
                      className="btn-small btn-delete"
                      onClick={() => handleDeleteFestival(festival._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;
