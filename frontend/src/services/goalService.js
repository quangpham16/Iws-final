import apiClient from './apiClient';

export const goalApi = {
    getAll: () => apiClient.get('/goals'),
    create: (data) => apiClient.post('/goals', data),
    delete: (id) => apiClient.delete(`/goals/${id}`)
};
