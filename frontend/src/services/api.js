import apiClient from './apiClient';
import { transactionApi } from './transactionService';
import { walletApi } from './walletService';
import { categoryApi } from './categoryService';

export const authApi = {
    login: (data) => apiClient.post('/auth/login', data),
    register: (data) => apiClient.post('/auth/register', data),
};

export const budgetApi = {
    getAll: () => apiClient.get('/budgets'),
    create: (data) => apiClient.post('/budgets', data),
    delete: (id) => apiClient.delete(`/budgets/${id}`),
};

export const goalApi = {
    getAll: () => apiClient.get('/goals'),
    create: (data) => apiClient.post('/goals', data),
    delete: (id) => apiClient.delete(`/goals/${id}`),
};

export const subscriptionApi = {
    getAll: () => apiClient.get('/subscriptions'),
    create: (data) => apiClient.post('/subscriptions', data),
    delete: (id) => apiClient.delete(`/subscriptions/${id}`),
};

export const payeeApi = {
    getAll: () => apiClient.get('/payees'),
    create: (data) => apiClient.post('/payees', data),
    delete: (id) => apiClient.delete(`/payees/${id}`),
};

export const tagApi = {
    getAll: () => apiClient.get('/tags'),
    create: (data) => apiClient.post('/tags', data),
    delete: (id) => apiClient.delete(`/tags/${id}`),
};

export { transactionApi, walletApi, categoryApi };
export default apiClient;
