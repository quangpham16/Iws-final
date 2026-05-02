import apiClient from './apiClient';

export const walletApi = {
    getAll: () => apiClient.get('/wallets'),
    getById: (id) => apiClient.get(`/wallets/${id}`),
    getTotalBalance: () => apiClient.get('/wallets/total-balance'),
    create: (data) => apiClient.post('/wallets', data),
    update: (id, data) => apiClient.put(`/wallets/${id}`, data),
    delete: (id) => apiClient.delete(`/wallets/${id}`),
};
