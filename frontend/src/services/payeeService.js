import apiClient from './apiClient';

export const payeeApi = {
    getAll: () => apiClient.get('/payees'),
    create: (data) => apiClient.post('/payees', data),
    delete: (id) => apiClient.delete(`/payees/${id}`)
};
