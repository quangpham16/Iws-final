import apiClient from './apiClient';

export const transactionApi = {
    getAll: () => apiClient.get('/transactions'),
    getById: (id) => apiClient.get(`/transactions/${id}`),
    getSummary: () => apiClient.get('/transactions/summary'),
    create: (data) => apiClient.post('/transactions', data),
    update: (id, data) => apiClient.put(`/transactions/${id}`, data),
    delete: (id) => apiClient.delete(`/transactions/${id}`),
    getByRange: (from, to) => apiClient.get(`/transactions/range?from=${from}&to=${to}`),
};
