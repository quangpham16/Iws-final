import apiClient from './apiClient';

export const tagApi = {
    getAll: () => apiClient.get('/tags'),
    create: (data) => apiClient.post('/tags', data),
    delete: (id) => apiClient.delete(`/tags/${id}`)
};
