// src/services/auth.js
import api from './api';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const register = async (firstName, lastName, email, password) => {
  const res = await api.post('/register', { firstName, lastName, email, password });
  return res.data;
};

export const login = async (email, password) => {
  const res = await api.post('/login', { email, password });
  const { token } = res.data;
  await AsyncStorage.setItem('token', token);
  return token;
};

export const logout = async () => {
  await AsyncStorage.removeItem('token');
};
