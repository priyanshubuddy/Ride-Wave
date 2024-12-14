import axios from 'axios';
import { IP_ADDRESS } from '../../config';
import { getAuthData } from './auth';

const ENV = {
  development: `http://${IP_ADDRESS.trim()}:3000`,
  production: 'https://ride-wave-backend-13ra.onrender.com'
};

// You can set this based on your build process
const currentEnv = process.env.NODE_ENV || 'development';

const axiosInstance = axios.create({
  baseURL: ENV[currentEnv],
  timeout: currentEnv === 'production' ? 30000 : 10000, // Longer timeout for production
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor
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

// Add response interceptor with better error handling
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized error
      console.log('Unauthorized, redirecting to login...');
      // You might want to dispatch a logout action here
    }
    
    // Add better error logging for debugging
    console.error('API Error:', {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      message: error.message,
      data: error.response?.data
    });

    return Promise.reject(error);
  }
);

export default axiosInstance;
