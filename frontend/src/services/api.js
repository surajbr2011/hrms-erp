import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
    baseURL: API_URL,
});

api.interceptors.request.use(
    (config) => {
        const userInfo = localStorage.getItem('userInfo');
        if (userInfo) {
            const parsed = JSON.parse(userInfo);
            if (parsed.token) {
                config.headers.Authorization = `Bearer ${parsed.token}`;
            }
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export default api;
