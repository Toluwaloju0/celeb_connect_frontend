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

    // --- USER ACTIONS ---

    const login = async (email, password) => {
        try {
            const response = await api.post('/auth/login', { email, password });
            
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

    const signup = async (payload) => {
        try {
            const response = await api.post('/auth/signup', payload);
            
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
            // UPDATED: /auth/logout
            await api.post('/auth/logout'); 
        } catch (err) {
            console.error("Logout error", err);
        } finally {
            setUser(null);
            localStorage.removeItem('user');
            window.location.href = '/login';
        }
    };

    // --- ADMIN ACTIONS ---

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

    const adminLogout = async () => {
        try {
            await api.post('/auth/admin/logout');
        } catch (err) {
            console.error("Admin logout error", err);
        } finally {
            setUser(null);
            localStorage.removeItem('user');
            window.location.href = '/admin/login';
        }
    };

    // --- AGENT ACTIONS ---

    const agentLogin = async (email, password) => {
        try {
            const response = await api.post('/auth/agent/login', { email, password });
            if (response.data.status === true) {
                const agentData = { ...response.data.data, role: 'agent' };
                setUser(agentData);
                localStorage.setItem('user', JSON.stringify(agentData));
                return { success: true, data: agentData };
            } else {
                return { success: false, message: response.data.message };
            }
        } catch (error) {
            return { success: false, message: error.response?.data?.message || "Agent access denied" };
        }
    };

    const agentLogout = async () => {
        try {
            await api.post('/auth/agent/logout');
        } catch (err) {
            console.error("Agent logout error", err);
        } finally {
            setUser(null);
            localStorage.removeItem('user');
            window.location.href = '/agent/login';
        }
    };

    return (
        <AuthContext.Provider value={{ 
            user, 
            loading,
            // User
            login, 
            signup, 
            logout,
            // Admin
            adminLogin, 
            adminLogout,
            // Agent
            agentLogin, 
            agentLogout 
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);