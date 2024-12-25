import api from './api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ApiResponse } from '../types/global';

interface AuthResponse {
  token: string;
  message?: string;
}

interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

interface LoginCredentials {
  email: string;
  password: string;
}

interface LoginResponse {
  token: string;
  message?: string;
}

interface LoginRequest {
  email: string;
  password: string;
}

export const register = async (
  firstName: string, 
  lastName: string, 
  email: string, 
  password: string
): Promise<ApiResponse<AuthResponse>> => {
  const res = await api.post<ApiResponse<AuthResponse>>('/register', { 
    firstName, 
    lastName, 
    email, 
    password 
  });
  return res.data;
};

export const login = async (
  email: string, 
  password: string
): Promise<string> => {
  try {
    // Validate email before sending request
    if (!email.includes('@') || !email.includes('.')) {
      throw new Error('Please enter a valid email address');
    }

    const response = await api.post<ApiResponse<LoginResponse>>('/login', {
      email: email.toLowerCase().trim(),
      password
    });

    if (!response.data?.data?.token) {
      throw new Error('Invalid login response: No token received');
    }

    const token = response.data.data.token;
    await AsyncStorage.setItem('token', token);
    return token;
  } catch (err: any) {
    // Handle specific error cases
    const statusCode = err.response?.status;
    const errorData = err.response?.data?.data || err.response?.data || err.message;

    if (statusCode === 500 && errorData.includes('Validation failed')) {
      throw new Error('Please enter a valid email address');
    } else if (statusCode === 401) {
      throw new Error('Invalid email or password');
    } else if (typeof errorData === 'string' && errorData.toLowerCase().includes('email')) {
      throw new Error('Please enter a valid email address');
    }
    
    throw new Error(errorData || 'Login failed');
  }
};

export const logout = async (): Promise<void> => {
  await AsyncStorage.removeItem('token');
};
