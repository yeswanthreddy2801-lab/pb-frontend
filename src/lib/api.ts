import axios from "axios";

export const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001/api";

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add a request interceptor to inject the token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("proteinbox_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add a response interceptor to unwrap data and handle 401s
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    // If we get a 401 Unauthorized, we might want to log the user out
    if (error.response?.status === 401) {
      localStorage.removeItem("proteinbox_token");
      // Optional: force a reload or redirect
      // window.location.href = "/login";
    }
    
    // Throw the error message provided by our backend, or a generic one
    const message = error.response?.data?.message || error.message || "An error occurred";
    return Promise.reject(new Error(message));
  }
);
