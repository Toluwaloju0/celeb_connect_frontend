import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        try {
            const response = await api.post('/login', { email, password });
            if (response.data.status === true) {
                const userData = { ...response.data.data, role: 'user' };
                setUser(userData);
                localStorage.setItem('user', JSON.stringify(userData));
                return { success: true };
            } else {
                return { success: false, message: response.data.message };
            }
        } catch (error) {
            return { success: false, message: error.response?.data?.message || "Login failed" };
        }
    };

    const adminLogin = async (email, password) => {
        try {
            const response = await api.post('/auth/admin/login', { email, password });
            if (response.data.status === true) {
                const adminData = { ...response.data.data, role: 'admin' };
                setUser(adminData);
                localStorage.setItem('user', JSON.stringify(adminData));
                return { success: true };
            } else {
                return { success: false, message: response.data.message };
            }
        } catch (error) {
            return { success: false, message: error.response?.data?.message || "Admin access denied" };
        }
    };

    // --- NEW: Agent Login ---
    const agentLogin = async (email, password) => {
        try {
            const response = await api.post('/auth/agent/login', { email, password });
            
            if (response.data.status === true) {
                // Save with 'agent' role
                const agentData = { ...response.data.data, role: 'agent' };
                setUser(agentData);
                localStorage.setItem('user', JSON.stringify(agentData));
                
                // Return the data so the UI can decide on the redirect
                return { success: true, data: agentData };
            } else {
                return { success: false, message: response.data.message };
            }
        } catch (error) {
            return { 
                success: false, 
                message: error.response?.data?.message || "Agent access denied" 
            };
        }
    };

    const signup = async (payload) => {
        try {
            const response = await api.post('/signup', payload);
            if (response.data.status === true) {
                const userData = { ...response.data.data, role: 'user' };
                setUser(userData);
                localStorage.setItem('user', JSON.stringify(userData));
                return { success: true };
            } else {
                return { success: false, message: response.data.message };
            }
        } catch (error) {
            return { success: false, message: error.response?.data?.message || "Signup failed" };
        }
    };

    const logout = async () => {
        try {
            await api.post('/logout'); 
        } catch (err) {
            console.error("Logout error", err);
        } finally {
            setUser(null);
            localStorage.removeItem('user');
            window.location.href = '/login';
        }
    };

    return (
        <AuthContext.Provider value={{ user, login, adminLogin, agentLogin, signup, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);