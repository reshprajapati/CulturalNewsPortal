import React from 'react';
import './Navigation.css';

function Navigation() {
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/';
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <a href="/" className="navbar-brand">🎭 Culture Portal</a>
        <ul className="nav-menu">
          <li><a href="/">Home</a></li>
          <li><a href="/festivals">Festivals</a></li>
          {user._id ? (
            <>
              <li><a href="/create-post">Write Post</a></li>
              <li><a href="/create-festival">Add Festival</a></li>
              {user.role === 'admin' && (
                <li><a href="/admin" className="admin-link">Admin</a></li>
              )}
              <li><span className="user-name">{user.name}</span></li>
              <li><button onClick={handleLogout}>Logout</button></li>
            </>
          ) : (
            <>
              <li><a href="/login">Login</a></li>
              <li><a href="/register">Register</a></li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
}

export default Navigation;
