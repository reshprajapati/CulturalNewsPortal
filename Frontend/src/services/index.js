import apiService from './api';

export const authService = {
  register: (name, email, password) =>
    apiService.post('/auth/register', { name, email, password }),

  login: (email, password) =>
    apiService.post('/auth/login', { email, password }),

  getProfile: () =>
    apiService.get('/auth/profile'),

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }
};

export const postService = {
  getAllPosts: (category, search) =>
    apiService.get('/posts', { params: { category, search } }),

  getPostById: (id) =>
    apiService.get(`/posts/${id}`),

  createPost: (title, content, category) =>
    apiService.post('/posts', { title, content, category }),

  createPostWithImage: (formData) =>
    apiService.post('/posts', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }),

  updatePost: (id, data) =>
    apiService.put(`/posts/${id}`, data),

  deletePost: (id) =>
    apiService.delete(`/posts/${id}`),

  likePost: (id) =>
    apiService.post(`/posts/${id}/like`),

  addComment: (id, text, rating) =>
    apiService.post(`/posts/${id}/comment`, { text, rating })
};

export const festivalService = {
  getAllFestivals: (category, festivalType, search) =>
    apiService.get('/festivals', { params: { category, festivalType, search } }),

  getFestivalById: (id) =>
    apiService.get(`/festivals/${id}`),

  getFestivalsByCategory: () =>
    apiService.get('/festivals/by-category'),

  createFestival: (name, description, festivalType, location, startDate, endDate, category, traditions) =>
    apiService.post('/festivals', { 
      name, description, festivalType, location, startDate, endDate, category, traditions 
    }),

  createFestivalWithImage: (formData) =>
    apiService.post('/festivals', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }),

  updateFestival: (id, data) =>
    apiService.put(`/festivals/${id}`, data),

  deleteFestival: (id) =>
    apiService.delete(`/festivals/${id}`)
};
