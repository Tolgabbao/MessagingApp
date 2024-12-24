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
    const response = await api.post<ApiResponse<LoginResponse>>('/login', {
      email: email.toLowerCase(),
      password
    });

    // Log the full response to debug
    console.log('Login response:', JSON.stringify(response.data, null, 2));

    // Check if we have a response and data property
    if (!response.data) {
      throw new Error('No response data received');
    }

    const token = response.data.data?.token;
    
    if (!token) {
      throw new Error('No token in response');
    }

    // Store token
    await AsyncStorage.setItem('token', token);
    return token;
  } catch (error: any) {
    console.error('Login error details:', {
      error: error,
      response: error.response?.data,
      status: error.response?.status
    });
    throw error;
  }
};

export const logout = async (): Promise<void> => {
  await AsyncStorage.removeItem('token');
};
