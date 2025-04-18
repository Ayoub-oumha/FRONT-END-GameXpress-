import axios from 'axios';

const axiosClient = axios.create({
    baseURL: import.meta.env.VITE_APP_API_URL,
    withCredentials: true,       
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
    },
});
// Request interceptor
axiosClient.interceptors.request.use(
    async (config) => {
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
// Response interceptor
axiosClient.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response.status === 401) {
            // Handle unauthorized access (e.g., redirect to login page)
            console.error('Unauthorized access - redirecting to login');
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/login'; // Redirect to login page
        }
        return Promise.reject(error);
    }
);
export default axiosClient;
