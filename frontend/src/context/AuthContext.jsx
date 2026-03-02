import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

// Create a configured axios instance
export const api = axios.create({
    baseURL: 'http://localhost:5000/api',
});

// Add interceptor to include token
api.interceptors.request.use((config) => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && user.token) {
        config.headers.Authorization = `Bearer ${user.token}`;
    }
    return config;
});

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check local storage for user
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        try {
            const res = await api.post('/auth/login', { email, password });

            const userData = {
                _id: res.data._id,
                name: res.data.name,
                email: res.data.email,
                role: res.data.role,
                token: res.data.token,
                profilePicture: res.data.profilePicture
            };

            setUser(userData);
            localStorage.setItem('user', JSON.stringify(userData));
            return { success: true };
        } catch (error) {
            return { success: false, message: error.response?.data?.message || 'Invalid credentials' };
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('user');
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
