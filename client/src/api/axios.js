import axios from 'axios';

const BASE_URL = '/api';

export default axios.create({
    baseURL: BASE_URL,
    headers: { 'Content-Type': 'application/json' },
});

export const axiosPrivate = axios.create({
    baseURL: BASE_URL,
    headers: { 'Content-Type': 'application/json' },
    withCredentials: true 
});

// Response Interceptor for global error handling
axiosPrivate.interceptors.response.use(
    response => response,
    async (error) => {
        const prevRequest = error?.config;
        if (error?.response?.status === 401 && !prevRequest?.sent) {
            // Ideally handle token refresh here
            // For now, if we get 401 and it's not retried, we pass the error down
            console.error('Unauthorized access. Please log in again.');
        } else if (error?.response?.status === 403) {
            console.error('Forbidden. You do not have permission.');
        } else if (error?.response?.status >= 500) {
            console.error('Server error occurred. Please try again later.');
        }
        return Promise.reject(error);
    }
);
