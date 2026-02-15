import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import authService from '../services/authService'; // Import our new service

const AuthContext = createContext();

export const useAuth = () => {
    return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        checkUserSession();
    }, []);

    const checkUserSession = async () => {
        try {
            const userData = await AsyncStorage.getItem('userData');
            const token = await AsyncStorage.getItem('userToken');

            if (userData && token) {
                setUser(JSON.parse(userData));
            }
        } catch (error) {
            console.error('Failed to restore session:', error);
        } finally {
            setLoading(false);
        }
    };

    // 🟢 LOGIN FUNCTION
    const login = async (email, password, rememberMe) => {
        try {
            // Call the real API
            const response = await authService.login(email, password);

            if (response.success) {
                // authService.login already saves 'userToken' and 'userData' to AsyncStorage
                // We just need to update local state
                setUser({ email });
                return { success: true };
            }
            return { success: false, message: response.message || 'Invalid response' };
        } catch (error) {
            return {
                success: false,
                message: error.message || 'Login failed. Please check your credentials.'
            };
        }
    };

    // 🔵 SIGNUP FUNCTION
    const signup = async ({ firstName, lastName, phone, country, email, password }) => {
        try {
            // ⚠️ BACKEND REQUIREMENT: Combine names into 'fullName'
            const fullName = `${firstName} ${lastName}`.trim();

            // Call the real API
            await authService.register({
                email,
                password,
                country,
                phone,
                fullName // Required field
            });

            return { success: true };
        } catch (error) {
            // Extract error message from backend response
            const msg = error.message || 'Signup failed. Please try again.';
            return { success: false, message: msg };
        }
    };

    // 🔴 LOGOUT FUNCTION
    const logout = async () => {
        try {
            await authService.logout();
            setUser(null);
        } catch (error) {
            console.error("Logout error", error);
        }
    };

    const value = {
        user,
        loading,
        login,
        signup,
        logout
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};
