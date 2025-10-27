import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.vite_API_BASE ||'http://localhost:3000/api',
  withCredentials:true
});

// Add token to every request
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;