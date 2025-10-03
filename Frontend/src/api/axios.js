// src/api/axios.js
import axios from 'axios';

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // ✅ dynamic for dev/prod
  withCredentials: true,
});

export default instance;