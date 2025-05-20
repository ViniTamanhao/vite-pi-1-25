import axios from "axios";

const api = axios.create({
  baseURL: "https://noode-js-pi-1-25.onrender.com/",
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("tokenPSICOUFRJ");

  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;
