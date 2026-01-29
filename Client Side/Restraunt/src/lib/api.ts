import axios, { AxiosInstance } from 'axios';

// ------------------------------
// Base URLs
// ------------------------------
const menusApiBase = 'https://tftmwqlm-5005.euw.devtunnels.ms/api';
const authApiBase = 'https://tftmwqlm-5265.euw.devtunnels.ms/api';

// ------------------------------
// Axios Instances
// ------------------------------
const menuApi: AxiosInstance = axios.create({
  baseURL: menusApiBase,
  
});

const authApi: AxiosInstance = axios.create({
  baseURL: authApiBase,
  headers: { 'Content-Type': 'application/json' },
});

// ------------------------------
// JWT Interceptor for menuApi
// ------------------------------
menuApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

menuApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/admin/login';
    }
    return Promise.reject(error);
  }
);

// ------------------------------
// Auth API
// ------------------------------
export const authAPI = {
  login: (email: string, password: string) =>
    authApi.post('/auth/login', { email, password }),
};

// ------------------------------
// Categories API
// ------------------------------
export const categoriesAPI = {
  getAll: () => menuApi.get('/category'),
  getById: (id: string) => menuApi.get(`/category/${id}`),
  create: (data: { name: string; description?: string }) => menuApi.post('/category', data),
  update: (id: string, data: { name: string; description?: string }) => menuApi.put(`/category/${id}`, data),
  delete: (id: string) => menuApi.delete(`/category/${id}`),
};

// ------------------------------
// Menu API
// ------------------------------
export const menuAPI = {
  getAll: () => menuApi.get('/menu'),
  getById: (id: string) => menuApi.get(`/menu/${id}`),

create: (formData: FormData) =>
  menuApi.post('/menu', formData),

 update: (id: string, formData: FormData) =>
  menuApi.put(`/menu/${id}`, formData),
  delete: (id: string) => menuApi.delete(`/menu/${id}`),
  toggleAvailability: (id: string) => menuApi.patch(`/menu/${id}/availability`),
};

// ------------------------------
// Dashboard API
// ------------------------------
export const dashboardAPI = {
  getStats: () => menuApi.get('/dashboard/stats'),
};

// ------------------------------
// Default Export
// ------------------------------
export default {
  menuApi,
  authApi,
  categoriesAPI,
  menuAPI,
  dashboardAPI,
  authAPI,
};
