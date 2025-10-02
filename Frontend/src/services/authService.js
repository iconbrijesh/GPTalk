// src/services/authService.js
import axios from '../api/axios';

export const loginUser = (email, password) => {
  return axios.post('/login', { email, password });
};

export const registerUser = (username, email, password) => {
  return axios.post('/register', { username, email, password });
};