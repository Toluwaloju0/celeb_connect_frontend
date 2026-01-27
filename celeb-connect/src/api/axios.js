import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL;

export const api = axios.create({
    baseURL: BASE_URL,
    headers: { 'Content-Type': 'application/json' },
    withCredentials: true 
});

// Helper to get refresh route based on role
const getRefreshEndpoint = () => {
    const userStr = localStorage.getItem('user');
    const user = userStr ? JSON.parse(userStr) : null;

    if (user?.role === 'admin') return '/auth/admin/refresh';
    if (user?.role === 'agent') return '/auth/agent/refresh';
    
    // Default User route updated
    return '/auth/token/refresh';
};

// --- RESPONSE INTERCEPTOR ---
api.interceptors.response.use(
    async (response) => {
        // CASE: 205 RESET CONTENT (Used as signal to Refresh Token)
        if (response.status === 205) {
            const originalRequest = response.config;

            if (!originalRequest._retry) {
                originalRequest._retry = true;
                try {
                    const refreshEndpoint = getRefreshEndpoint();
                    
                    // Call Refresh
                    await api.post(refreshEndpoint);
                    
                    // Retry Original Request
                    return api(originalRequest);
                } catch (refreshError) {
                    console.error("Refresh failed", refreshError);
                    // Fallthrough to logout logic below
                    handleLogout();
                    return Promise.reject(refreshError);
                }
            }
        }
        return response;
    },
    (error) => {
        // CASE: 500 INTERNAL SERVER ERROR
        if (error.response?.status === 500) {
            alert(error.response.data?.message || "Internal Server Error occurred.");
            return Promise.reject(error);
        }

        // CASE: 401 UNAUTHORIZED
        if (error.response?.status === 401) {
            handleLogout();
            return Promise.reject(error);
        }

        return Promise.reject(error);
    }
);

// Helper function to clear state and redirect
const handleLogout = () => {
    localStorage.removeItem('user');
    // Always redirect to the main User Login page as requested
    window.location.href = '/login';
};

export default api;