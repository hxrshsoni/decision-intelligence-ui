import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getProfile: () => api.get('/auth/profile')
};

// Data API
export const dataAPI = {
  uploadClients: (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post('/data/upload/clients', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },
  uploadEngagements: (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post('/data/upload/engagements', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },
  uploadPayments: (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post('/data/upload/payments', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },
  uploadWorkRequests: (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post('/data/upload/work-requests', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },
  getClients: () => api.get('/data/clients'),
  getSummary: () => api.get('/data/summary')
};

// Reports API
export const reportsAPI = {
  generate: () => api.post('/reports/generate'),
  getLatest: () => api.get('/reports/latest'),
  getHistory: () => api.get('/reports/history'),
  triggerWeekly: () => api.post('/reports/trigger-weekly')
};

export default api;
