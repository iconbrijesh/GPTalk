// src/api/axios.js
import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://localhost:8080', // your backend port
  withCredentials: true, // allows cookies/session
});

export default instance;