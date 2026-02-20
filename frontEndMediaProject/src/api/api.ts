import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to every request if it exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const login = (email: string, password: string) => {
  return api.post('/auth/login', { email, password });
};

export const register = (username: string, email: string, password: string) => {
  return api.post('/auth/register', { username, email, password });
};

export const createComment = (contentTitle: string, contentType: string, text: string, rating?: number) => {
  return api.post('/media-comments', { contentTitle, contentType, text, rating });
};

export const getComments = (contentTitle: string, contentType: string) => {
  return api.get(`/media-comments/${contentType}/${encodeURIComponent(contentTitle)}`);
};

export const updateComment = (commentId: string, text: string, rating?: number) => {
  return api.put(`/media-comments/${commentId}`, { text, rating });
};

export const deleteComment = (commentId: string) => {
  return api.delete(`/media-comments/${commentId}`);
};

export default api;