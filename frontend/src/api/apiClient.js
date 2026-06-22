import axios from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('bem_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('bem_token');
      const authPaths = ['/login', '/register'];
      if (!authPaths.includes(window.location.pathname)) {
        window.location.href = '/login';
      }
    }
    if (error.response) {
      const msg = error.response.data?.message || 'Terjadi kesalahan server';
      return Promise.reject(new Error(msg));
    }
    if (error.request) {
      return Promise.reject(new Error('Gagal terhubung ke server. Pastikan backend berjalan.'));
    }
    return Promise.reject(error);
  }
);

export default apiClient;
