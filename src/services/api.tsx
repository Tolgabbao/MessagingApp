import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ApiResponse } from '../types/global';

const instance: AxiosInstance = axios.create({
  baseURL: 'http://10.51.55.179:8080',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

instance.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (token && config.headers) {
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

// Add response interceptor to normalize data structure
instance.interceptors.response.use(
  (response: AxiosResponse) => {
    // Log the raw response for debugging
    console.log('API Response:', {
      url: response.config.url,
      method: response.config.method,
      data: response.data
    });

    // If response is already in our format, return it
    if (response.data?.data !== undefined) {
      return response;
    }

    // Wrap raw response data in our expected format
    return {
      ...response,
      data: {
        data: Array.isArray(response.data) ? response.data : response.data,
        message: response.data?.message || null,
        error: null
      }
    };
  },
  (error) => {
    console.error('API Error:', {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      data: error.response?.data
    });
    return Promise.reject(error);
  }
);

export const acceptFriendRequest = async (email: string): Promise<ApiResponse<any>> => {
  const res = await instance.post('/friends/accept', { email });
  return res.data;
};

export default instance;
