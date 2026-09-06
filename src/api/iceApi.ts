import { useAuthStore } from '@/stores/auth-store';
import axios from 'axios';

const rawBaseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const cleanBaseURL = rawBaseURL.replace(/\/+$/, '');

export const iceApi = axios.create({
  baseURL: `${cleanBaseURL}/api/v1`,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  },
});

iceApi.interceptors.request.use((config) => {
  // Obtén el token directamente del store en cada petición
  const token = useAuthStore.getState().token;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});