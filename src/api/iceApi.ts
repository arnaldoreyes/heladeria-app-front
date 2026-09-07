import axios from 'axios';
import { useAuthStore } from '@/stores/auth-store';

const rawBaseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const cleanBaseURL = rawBaseURL.replace(/\/+$/, '');

export const iceApi = axios.create({
  baseURL: `${cleanBaseURL}/api/v1`,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  },
});

// 1. Inyectar el token actual en cada petición
iceApi.interceptors.request.use((config) => {
  const token = useAuthStore.getState().access_token;
  const type = useAuthStore.getState().token_type || 'Bearer';
  if (token) {
    config.headers.Authorization = `${type} ${token}`;
  }
  return config;
});

// 2. Controladores para evitar bucles infinitos si el refresh falla
let isRefreshing = false;
let failedQueue: Array<{ resolve: (token: string) => void; reject: (error: any) => void }> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token!);
    }
  });
  failedQueue = [];
};

// 3. Interceptar respuestas 401
iceApi.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Si da 401 y no hemos reintentado esta petición aún
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // Si hay un refresco en curso, encolamos la petición
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `${useAuthStore.getState().token_type} ${token}`;
            return iceApi(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const currentStore = useAuthStore.getState();

        // Petición al endpoint de Laravel para refrescar
        const { data } = await axios.post(
          `${iceApi.defaults.baseURL}/auth/refresh`,
          {},
          {
            headers: {
              Authorization: `${currentStore.token_type} ${currentStore.access_token}`,
            },
          }
        );

        // Actualizamos Zustand con el nuevo token y datos vigentes
        currentStore.setSession({
          user: currentStore.user!,
          business: currentStore.business!,
          access_token: data.access_token,
          token_type: data.token_type || 'Bearer',
          expires_at: data.expires_at,
        });

        processQueue(null, data.access_token);
        originalRequest.headers.Authorization = `${data.token_type} ${data.access_token}`;
        return iceApi(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        // Si el refresh falla (ej. expiró por completo), limpiamos la sesión y mandamos al login
        useAuthStore.getState().logout();
        window.location.href = '/login';
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);