import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // On app load, check if we have user data in localStorage
        // OR optionally hit a '/me' endpoint to validate the cookie
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        try {
            const response = await api.post('/auth/login', { email, password });
            
            if (response.data.status === true) {
                const userData = response.data.data;
                setUser(userData);
                // We store non-sensitive user info in localStorage for UI persistence
                // The TOKENS are safely in HttpOnly cookies handled by the browser
                localStorage.setItem('user', JSON.stringify(userData));
                return { success: true };
            } else {
                return { success: false, message: response.data.message };
            }
        } catch (error) {
            return { 
                success: false, 
                message: error.response?.data?.message || "Login failed" 
            };
        }
    };

    const signup = async (payload) => {
        try {
            const response = await api.post('/auth/signup', payload);
            if (response.data.status === true) {
                const userData = response.data.data;
                setUser(userData);
                localStorage.setItem('user', JSON.stringify(userData));
                return { success: true };
            } else {
                return { success: false, message: response.data.message };
            }
        } catch (error) {
            return { 
                success: false, 
                message: error.response?.data?.message || "Signup failed" 
            };
        }
    };

    const logout = async () => {
        try {
            await api.post('/auth/logout'); // Inform backend to clear cookies
        } catch (err) {
            console.error("Logout error", err);
        } finally {
            setUser(null);
            localStorage.removeItem('user');
            window.location.href = '/login';
        }
    };

    return (
        <AuthContext.Provider value={{ user, login, signup, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);