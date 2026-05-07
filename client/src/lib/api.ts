import axios from 'axios';
import { HomeData } from '../types';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const fetchHomeData = async (): Promise<HomeData> => {
  const response = await api.get<HomeData>('/home');
  return response.data;
};

export const getAdminHeaders = () => {
  const password = localStorage.getItem('adminPassword');
  return password ? { 'x-admin-password': password } : {};
};

export default api;