import axios from 'axios';

const apiClient = axios.create({
    baseURL: 'http://localhost:8080/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

// ── Request interceptor: attach user id ───────────────────────────────────────
apiClient.interceptors.request.use((config) => {
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    if (user && user.id) {
        config.headers['X-User-Id'] = user.id;
    }
    return config;
});

// ── Response interceptor: centralised error handling ──────────────────────────
apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        const status   = error.response?.status;
        const data     = error.response?.data;
        const message  = data?.message || error.message || 'An unexpected error occurred';

        // Derive a user-friendly toast message
        let toastMsg = message;
        if (status === 400) toastMsg = data?.message || 'Invalid request. Please check your input.';
        if (status === 401) toastMsg = 'You are not authorised. Please log in again.';
        if (status === 403) toastMsg = 'You do not have permission to perform this action.';
        if (status === 404) toastMsg = data?.message || 'The requested resource was not found.';
        if (status === 409) toastMsg = data?.message || 'Conflict: the resource already exists or is in use.';
        if (status >= 500)  toastMsg = 'Server error. Please try again later.';

        // Fire toast via the global singleton (set by ToastProvider)
        if (window.__showErrorToast) {
            window.__showErrorToast(toastMsg);
        }

        // Log for debugging
        console.error(`[API ${status ?? 'ERR'}] ${error.config?.url}:`, message);

        return Promise.reject(error);
    }
);

export default apiClient;
