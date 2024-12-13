import axios from 'axios';
import { IP_ADDRESS } from '../../config';
import { getAuthData } from './auth';

const devUrl = `http://${IP_ADDRESS.trim()}:3000`;
const prodUrl = 'https://ride-wave-backend-13ra.onrender.com';
const mode = 'development';

const axiosInstance = axios.create({
  baseURL: mode === 'development' ? devUrl : prodUrl,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor
axiosInstance.interceptors.request.use(
  async (config) => {
    try {
      const { token } = await getAuthData();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    } catch (error) {
      return Promise.reject(error);
    }
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized error (e.g., redirect to login)
      console.log('Unauthorized, redirecting to login...');
      // You might want to dispatch a logout action here
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
