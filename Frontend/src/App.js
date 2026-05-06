import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navigation from './components/Navigation';
import Login from './components/Login';
import Register from './components/Register';
import HomePage from './components/HomePage';
import PostList from './components/PostList';
import CreatePost from './components/CreatePost';
import FestivalList from './components/FestivalList';
import CreateFestival from './components/CreateFestival';
import AdminDashboard from './components/AdminDashboard';
import './App.css';

function App() {
  const isAuthenticated = !!localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const isAdmin = user.role === 'admin';

  return (
    <BrowserRouter>
      <Navigation />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/posts" element={<PostList />} />
        <Route path="/festivals" element={<FestivalList />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route 
          path="/create-post" 
          element={isAuthenticated ? <CreatePost /> : <Login />} 
        />
        <Route 
          path="/create-festival" 
          element={isAuthenticated ? <CreateFestival /> : <Login />} 
        />
        <Route 
          path="/admin" 
          element={isAdmin ? <AdminDashboard /> : <Navigate to="/login" />} 
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
