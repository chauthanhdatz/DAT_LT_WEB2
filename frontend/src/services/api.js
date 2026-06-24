import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Add JWT token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth
export const authAPI = {
  login: (data) => api.post('/auth/login', data),
  register: (data) => api.post('/auth/register', data),
};

// Pets
export const petAPI = {
  getAll: (params) => api.get('/pets', { params }),
  getById: (id) => api.get(`/pets/${id}`),
  create: (formData) => api.post('/pets', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  update: (id, formData) => api.put(`/pets/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  delete: (id) => api.delete(`/pets/${id}`),
  updateStatus: (id, status) => api.put(`/pets/${id}`, { status }),
};

// Shelters
export const shelterAPI = {
  getAll: (params) => api.get('/shelters', { params }),
  getAllAdmin: () => api.get('/shelters/all'),
  getById: (id) => api.get(`/shelters/${id}`),
  create: (data) => api.post('/shelters', data),
  update: (id, data) => api.put(`/shelters/${id}`, data),
  delete: (id) => api.delete(`/shelters/${id}`),
  getMy: () => api.get('/shelters/my'),
  approve: (id) => api.put(`/shelters/${id}/approve`),
  ban: (id, reason) => api.put(`/shelters/${id}/ban`, { reason }),
};

// Users
export const userAPI = {
  getAll: () => api.get('/users'),
  delete: (id) => api.delete(`/users/${id}`),
};

// Adoptions
export const adoptionAPI = {
  create: (data) => api.post('/adoptions', data),
  updateStatus: (id, status, rejectReason) => api.put(`/adoptions/${id}`, { status, rejectReason }),
  getMy: () => api.get('/adoptions/my'),
  getByShelter: (shelterId) => api.get(`/adoptions/shelter/${shelterId}`),
};

// Donations
export const donationAPI = {
  create: (data) => api.post('/donations', data),
  getMy: () => api.get('/donations/my'),
  getAll: () => api.get('/donations'),
  getByCampaign: (campaignId) => api.get(`/donations/campaign/${campaignId}`),
};

// Lost Pets
export const lostPetAPI = {
  getAll: (params) => api.get('/lost-pets', { params }),
  create: (formData) => api.post('/lost-pets', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  updateStatus: (id, status) => api.put(`/lost-pets/${id}/status`, { status }),
  resolve: (id) => api.put(`/lost-pets/${id}/resolve`),
};

// Campaigns
export const campaignAPI = {
  getAll: (params) => api.get('/campaigns', { params }),
  getById: (id) => api.get(`/campaigns/${id}`),
  getByShelter: (shelterId) => api.get(`/campaigns/shelter/${shelterId}`),
  create: (data, shelterId) => api.post(`/campaigns?shelterId=${shelterId}`, data),
  update: (id, data) => api.put(`/campaigns/${id}`, data),
};

// Reports
export const reportAPI = {
  create: (data) => api.post('/reports', data),
  getAll: () => api.get('/reports'),
  updateStatus: (id, status, adminNote) => api.put(`/reports/${id}`, { status, adminNote }),
};

// Stats
export const statsAPI = {
  get: () => api.get('/stats'),
};

export default api;

