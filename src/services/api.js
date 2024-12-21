// src/services/api.js
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const instance = axios.create({
  baseURL: 'http://192.168.0.241:8080', // Replace with your backend endpoint base URL
});

instance.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const acceptFriendRequest = async (email) => {
  const res = await instance.post('/friends/accept', { email });
  return res.data;
};


export default instance;
