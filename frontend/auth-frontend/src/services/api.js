// src/services/api.js
import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:3000', // your backend URL
});

// Attach token to requests
API.interceptors.request.use((req) => {
  const token = localStorage.getItem('accessToken');
  if (token) req.headers.Authorization = `Bearer ${token}`;
  return req;
});

export default API;
