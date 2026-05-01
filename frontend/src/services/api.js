import apiClient from './apiClient';
import { transactionApi } from './transactionService';
import { walletApi } from './walletService';
import { categoryApi } from './categoryService';
import { budgetApi } from './budgetService';
import { goalApi } from './goalService';
import { subscriptionApi } from './subscriptionService';
import { payeeApi } from './payeeService';
import { tagApi } from './tagService';

export const authApi = {
    login: (data) => apiClient.post('/auth/login', data),
    register: (data) => apiClient.post('/auth/register', data),
};

export { 
    transactionApi, 
    walletApi, 
    categoryApi, 
    budgetApi, 
    goalApi, 
    subscriptionApi, 
    payeeApi, 
    tagApi 
};

export default apiClient;
