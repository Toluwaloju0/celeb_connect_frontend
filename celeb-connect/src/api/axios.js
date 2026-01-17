import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL;

// Create the axios instance
export const api = axios.create({
    baseURL: BASE_URL,
    headers: { 'Content-Type': 'application/json' },
    withCredentials: true // IMPORTANT: This tells the browser to send/receive cookies
});

// Response Interceptor (The Refresh Logic)
api.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        const originalRequest = error.config;

        // If error is 401 (Unauthorized) and we haven't retried yet
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                // Call the backend refresh endpoint
                // The browser automatically sends the 'refresh_token' cookie here
                await api.post('/refresh');

                // If successful, the backend sets a new 'access_token' cookie.
                // We retry the original request
                return api(originalRequest);
            } catch (refreshError) {
                // If refresh fails (token expired or invalid), logout the user
                console.error("Session expired", refreshError);
                localStorage.removeItem('user'); // Clear local UI data
                window.location.href = '/login'; // Force redirect
                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error);
    }
);

export default api;