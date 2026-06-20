import axios from 'axios';
import { auth } from './authService';

const BASE_URL = 'http://10.0.2.2:8081/api/users';

const getHeaders = async () => {
  const uid = auth.currentUser?.uid;
  return {
    'X-User-Id': uid,
    'Content-Type': 'application/json'
  };
};

export const getProfile = async () => {
  const headers = await getHeaders();
  const response = await axios.get(`${BASE_URL}/me`, { headers });
  return response.data;
};

export const updateProfile = async (data) => {
  const headers = await getHeaders();
  const response = await axios.put(`${BASE_URL}/me`, data, { headers });
  return response.data;
};

export const updatePhoto = async (photoUrl) => {
  const headers = await getHeaders();
  const response = await axios.put(`${BASE_URL}/me/photo`, { photoUrl }, { headers });
  return response.data;
};

export const updateLocalisation = async (localisation) => {
  const headers = await getHeaders();
  const response = await axios.put(`${BASE_URL}/me/localisation`, localisation, { headers });
  return response.data;
};

export const registerUserBackend = async (userData) => {
  const response = await axios.post(`${BASE_URL}/register`, userData);
  return response.data;
};