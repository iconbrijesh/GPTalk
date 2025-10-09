// src/services/authService.js
import axios from '../api/axios';

export const loginUser = (email, password) => {
  return axios.post('/login', { email, password });
};

export const registerUser = (username, email, password) => {
  return axios.post('/register', { username, email, password });
};

export const verifyEmail = (token) => {
  return axios.get(`/verify-email/${token}`);
};

export const resendVerificationEmail = () => {
  return axios.post('/resend-verification');
};