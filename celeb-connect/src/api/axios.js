import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL;

// Create the axios instance
export const api = axios.create({
    baseURL: BASE_URL,
    headers: { 'Content-Type': 'application/json' },
    withCredentials: true 
});

// Response Interceptor
api.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                // 1. Determine User Role
                const userStr = localStorage.getItem('user');
                const user = userStr ? JSON.parse(userStr) : null;
                
                // 2. Select Refresh Endpoint based on Role
                let refreshEndpoint = '/refresh'; // Default User
                
                if (user?.role === 'admin') {
                    refreshEndpoint = '/auth/admin/refresh';
                } else if (user?.role === 'agent') {
                    // Assuming Agent follows the same pattern
                    refreshEndpoint = '/auth/agent/refresh';
                }

                // 3. Call Refresh
                await api.post(refreshEndpoint);

                // 4. Retry
                return api(originalRequest);
                
            } catch (refreshError) {
                console.error("Session expired", refreshError);
                localStorage.removeItem('user'); 
                
                // Dynamic Redirect based on where they were
                const path = window.location.pathname;
                if (path.startsWith('/admin')) {
                    window.location.href = '/admin/login';
                } else if (path.startsWith('/agent')) {
                    window.location.href = '/agent/login';
                } else {
                    window.location.href = '/login';
                }
                
                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error);
    }
);

export default api;