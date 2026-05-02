import apiClient from './apiClient';

export const budgetApi = {
    getAll: () => apiClient.get('/budgets'),
    create: (data) => apiClient.post('/budgets', data),
    delete: (id) => apiClient.delete(`/budgets/${id}`)
};
