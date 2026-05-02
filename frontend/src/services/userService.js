import apiClient from './apiClient';

export const userApi = {
    getProfile: (email) => apiClient.get('/users/me', { params: { email } }),
    updateProfile: (email, data) => apiClient.put('/users/me', data, { params: { email } }),
    changePassword: (email, data) => apiClient.put('/users/me/password', data, { params: { email } }),
    uploadAvatar: (email, formData) => apiClient.post('/users/me/avatar', formData, {
        params: { email },
        headers: { 'Content-Type': 'multipart/form-data' }
    }),
};
