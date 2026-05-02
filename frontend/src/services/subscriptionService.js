import apiClient from './apiClient';

export const subscriptionApi = {
    getAll: () => apiClient.get('/subscriptions'),
    create: (data) => apiClient.post('/subscriptions', data),
    update: (id, data) => apiClient.put(`/subscriptions/${id}`, data),
    delete: (id) => apiClient.delete(`/subscriptions/${id}`)
};
