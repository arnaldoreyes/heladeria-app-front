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

// 2. Controladores para evitar bucles infinitos en el refresh
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

// 3. Interceptar respuestas y errores
iceApi.interceptors.response.use(
  (response) => {
    // Verificamos si la respuesta viene con nuestra envoltura estandarizada
    if (response.data && typeof response.data === 'object' && 'success' in response.data) {
      const { data, meta, links, message } = response.data;

      // Preservamos las propiedades en response.data para facilitar el acceso en el Frontend
      response.data = data !== undefined ? data : response.data;
      console.log(response.data);
      // Adjuntamos la metadata directamente en la respuesta de Axios por si se necesita en listas paginadas
      if (meta) (response as any).meta = meta;
      if (links) (response as any).links = links;
      if (message) (response as any).message = message;
    }
    
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    const status = error.response?.status;

    // --- MANEJO DE REFRESH TOKEN (401) ---
    if (status === 401 && !originalRequest._retry) {
      // Evitamos refrescar si la petición que falló fue el propio login o refresh
      if (originalRequest.url?.includes('/auth/login') || originalRequest.url?.includes('/auth/refresh')) {
        useAuthStore.getState().logout();
        return Promise.reject(normalizeError(error));
      }

      if (isRefreshing) {
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

        const { data: response } = await axios.post(
          `${iceApi.defaults.baseURL}/auth/refresh`,
          {},
          {
            headers: {
              Authorization: `${currentStore.token_type} ${currentStore.access_token}`,
              Accept: 'application/json',
            },
          }
        );

        // Como Laravel devuelve { success: true, data: { access_token, token_type, ... } }
        const tokenData = response.data; 

        currentStore.setSession({
          user: currentStore.user!,
          business: currentStore.business!,
          access_token: tokenData.access_token,
          token_type: tokenData.token_type || 'Bearer',
          expires_at: tokenData.expires_at,
        });

        processQueue(null, tokenData.access_token);
        originalRequest.headers.Authorization = `${tokenData.token_type} ${tokenData.access_token}`;
        return iceApi(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        useAuthStore.getState().logout();
        window.location.href = '/auth/login';
        return Promise.reject(normalizeError(refreshError));
      } finally {
        isRefreshing = false;
      }
    }

    // Retorna un error con estructura limpia y predecible
    return Promise.reject(normalizeError(error));
  }
);

/**
 * Normaliza los errores recibidos de Laravel para un manejo limpio en UI / Forms
 */
function normalizeError(error: any) {
  const responseData = error.response?.data;
  const status = error.response?.status;

  return {
    status,
    isValidationError: status === 422,
    message: responseData?.message || 'Ocurrió un error inesperado.',
    errors: responseData?.errors || null, // Objeto { campo: ["mensaje"] } en 422
    originalError: error,
  };
}