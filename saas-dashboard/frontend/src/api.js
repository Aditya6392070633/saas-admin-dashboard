import axios from "axios";

// In dev, Vite's proxy forwards "/api" to localhost:4000 (see vite.config.js).
// In production, set VITE_API_URL to your deployed backend URL, e.g.
// https://your-backend.onrender.com/api
const baseURL = import.meta.env.VITE_API_URL || "/api";

const api = axios.create({
  baseURL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(err);
  }
);

export default api;
