import axios from 'axios';

const API_BASE = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE,
  timeout: 10000,
});

// Fundraiser APIs
export const createFundraiser = (data) => api.post('/fundraisers', data);
export const getFundraiser = (id) => api.get(`/fundraisers/${id}`);
export const updateFundraiser = (id, data) => api.put(`/fundraisers/${id}`, data);
export const closeFundraiser = (id) => api.put(`/fundraisers/${id}/close`);
export const exportCSV = (id) => `${API_BASE}/fundraisers/${id}/export`;

// Contribution APIs
export const addContribution = (data) => api.post('/contributions', data);
export const getContributions = (fundraiserId) => api.get(`/contributions/${fundraiserId}`);
export const confirmContribution = (id) => api.put(`/contributions/${id}/confirm`);
export const deleteContribution = (id) => api.delete(`/contributions/${id}`);

export default api;
