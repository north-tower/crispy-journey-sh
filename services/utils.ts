import axios from 'axios';

// Check if the code is running in the browser (client-side)
const isBrowser = typeof window !== 'undefined';

// Create the axios instance
const axiosInstance = axios.create({
  baseURL: 'http://localhost:8900/api', // Replace with your actual API base URL
});

// Interceptor to add Authorization header if running on the client-side
axiosInstance.interceptors.request.use((config) => {
  if (isBrowser) {
    const token = localStorage.getItem('token'); // Get token from localStorage
    console.log(token)
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`; // Attach token to request
    }
  }
  return config;
});

export default axiosInstance;
