import axios from "axios";

const api = axios.create({
  baseURL: "https://applyly-4r4o.onrender.com/api", // ✅ adjust for backend host
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
