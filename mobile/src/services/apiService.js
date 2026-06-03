import axios from 'axios';

const API_BASE_URL = 'http://10.144.201.153:8083/api'; // Android emulator
// const API_BASE_URL = 'http://localhost:8083/api'; // iOS ou web

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Conversations
export const createConversation = async (user1, user2) => {
  const response = await api.post('/conversations/create', { user1, user2 });
  return response.data;
};

export const getUserConversations = async (userId) => {
  const response = await api.get(`/conversations/user/${userId}`);
  return response.data;
};

export const sendMessage = async (conversationId, senderId, receiverId, content) => {
  const response = await api.post(`/conversations/${conversationId}/messages`, {
    senderId,
    receiverId,
    content,
  });
  return response.data;
};

export const getMessages = async (conversationId) => {
  const response = await api.get(`/conversations/${conversationId}/messages`);
  return response.data;
};

export const markAsRead = async (conversationId, userId) => {
  const response = await api.put(`/conversations/${conversationId}/read/${userId}`);
  return response.data;
};