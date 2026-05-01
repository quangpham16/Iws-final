import apiClient from './apiClient';

export const subscriptionApi = {
    getAll: () => apiClient.get('/subscriptions'),
    create: (data) => apiClient.post('/subscriptions', data),
    delete: (id) => apiClient.delete(`/subscriptions/${id}`)
};
