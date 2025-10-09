import axios from "axios";
import { toast } from "react-toastify";

// Set base config
axios.defaults.baseURL = import.meta.env.VITE_API_BASE_URL;
axios.defaults.withCredentials = true;

// Add interceptor
axios.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      localStorage.removeItem("accessToken");
      toast.error("Session expired. Please log in again.");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default axios;