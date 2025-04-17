import axios from 'axios';

const axiosClient = axios.create({
    baseURL: import.meta.env.VITE_APP_API_URL,
    withCredentials: true, // This is crucial for cookies to be sent
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
    },
});

// Request interceptor - simplifié
axiosClient.interceptors.request.use(
    async (config) => {
        // JWT token for authenticated requests
        const token = localStorage.getItem('token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor - simplifié
axiosClient.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        if (error.response?.status === 401) {
            // Handle unauthorized access
            console.error('Unauthorized access - redirecting to login');
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default axiosClient;