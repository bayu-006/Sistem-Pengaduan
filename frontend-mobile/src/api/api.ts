import axios from 'axios';
import Storage from '../utils/storage';
import { Platform } from 'react-native';

const API = axios.create({
  baseURL:
    Platform.OS === 'web'
      ? 'http://localhost:5000/api'
      : 'http://192.168.137.1:5000/api',
});

API.interceptors.request.use(
  async (config) => {
    try {
      const token = await Storage.getItem('token');

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      console.log(`📤 API Request:`, {
        url: config.url,
        method: config.method,
        baseURL: config.baseURL,
      });
    } catch (error) {
      console.warn('⚠️ Token read error:', error);
    }

    return config;
  },
  (error) => {
    console.log('❌ Request error:', error.message);
    return Promise.reject(error);
  }
);

// Response interceptor untuk logging
API.interceptors.response.use(
  (response) => {
    console.log(`📥 API Response: ${response.config.url}`, response.status);
    return response;
  },
  (error) => {
    console.log('❌ Response error:', {
      message: error.message,
      status: error?.response?.status,
      data: error?.response?.data,
    });
    return Promise.reject(error);
  }
);

export default API;