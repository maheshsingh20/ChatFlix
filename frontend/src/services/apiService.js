import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '../utils/config';

const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - Add auth token
api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log(`📡 API Request: ${config.method.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('❌ API Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    console.log(`✅ API Response: ${response.config.url}`, response.status);
    return response;
  },
  (error) => {
    console.error('❌ API Response Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export const apiService = {
  // Auth
  register: async (username, email, password, displayName) => {
    const response = await api.post('/api/auth/register', { username, email, password, displayName });
    return response.data;
  },

  login: async (email, password) => {
    const response = await api.post('/api/auth/login', { email, password });
    return response.data;
  },

  // Users
  searchUsers: async (query) => {
    const response = await api.get('/api/users/search', { params: { query } });
    return response.data;
  },

  getContacts: async () => {
    const response = await api.get('/api/users/contacts');
    return response.data;
  },

  // Chat Rooms
  getRooms: async () => {
    const response = await api.get('/api/chats/rooms');
    return response.data;
  },

  getPrivateRoom: async (userId) => {
    const response = await api.get(`/api/chats/rooms/private/${userId}`);
    return response.data;
  },

  createGroupRoom: async (name, participantIds) => {
    const response = await api.post('/api/chats/rooms/group', { name, participantIds });
    return response.data;
  },

  // Messages
  getRoomMessages: async (roomId, limit = 50, skip = 0) => {
    const response = await api.get(`/api/chats/rooms/${roomId}/messages`, {
      params: { limit, skip },
    });
    return response.data;
  },

  sendMessage: async (roomId, message) => {
    const response = await api.post(`/api/chats/rooms/${roomId}/messages`, { message });
    return response.data;
  },

  updateMessageStatus: async (messageId, status) => {
    const response = await api.patch(`/api/messages/${messageId}/status`, { status });
    return response.data;
  },

  // Health check
  healthCheck: async () => {
    const response = await api.get('/health');
    return response.data;
  },
};

export default api;
