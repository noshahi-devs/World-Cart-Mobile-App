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
                // Optionally refresh profile in background
                fetchFullProfile();
            }
        } catch (error) {
            console.error('Failed to restore session:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchFullProfile = async () => {
        try {
            const profile = await authService.getUserProfile();
            if (profile && profile.user) {
                const fullUserData = {
                    ...profile.user,
                    tenantId: profile.tenant?.id,
                    tenancyName: profile.tenant?.tenancyName
                };
                setUser(fullUserData);
                await AsyncStorage.setItem('userData', JSON.stringify(fullUserData));
            }
        } catch (error) {
            console.error('Background profile fetch failed:', error);
        }
    };

    // 🟢 LOGIN FUNCTION
    const login = async (email, password, rememberMe) => {
        try {
            // Call the real API
            const response = await authService.login(email, password);

            if (response.success) {
                // Fetch full profile info immediately after login
                const profile = await authService.getUserProfile();
                const fullUserData = {
                    email,
                    id: response.userId,
                    ...profile?.user,
                    tenantId: profile?.tenant?.id
                };

                setUser(fullUserData);
                await AsyncStorage.setItem('userData', JSON.stringify(fullUserData));
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
            const fullName = `${firstName.trim()} ${lastName.trim()}`.trim();

            // Call the real API
            await authService.register({
                email: email.trim(),
                password: password.trim(),
                country: country.trim(),
                phone: phone.trim(),
                fullName, // Required field
                firstName: firstName.trim(),
                lastName: lastName.trim()
            });

            return { success: true };
        } catch (error) {
            // Extract error message from backend response
            const msg = error.message || 'Signup failed. Please try again.';
            return { success: false, message: msg };
        }
    };

    // 🔑 FORGOT PASSWORD
    const forgotPassword = async (email) => {
        try {
            await authService.forgotPassword(email);
            return { success: true };
        } catch (error) {
            return { success: false, message: error.message };
        }
    };

    // 🔒 RESET PASSWORD
    const resetPassword = async (data) => {
        try {
            await authService.resetPassword(data);
            return { success: true };
        } catch (error) {
            return { success: false, message: error.message };
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

    // 📝 UPDATE PROFILE (LOCAL ONLY AS REQUESTED)
    const updateProfile = async (profileData) => {
        try {
            const updatedUser = {
                ...user,
                ...profileData,
                // Automatically update fullName if names exist
                fullName: profileData.firstName && profileData.lastName
                    ? `${profileData.firstName} ${profileData.lastName}`
                    : user?.fullName
            };

            setUser(updatedUser);
            await AsyncStorage.setItem('userData', JSON.stringify(updatedUser));
            return { success: true };
        } catch (error) {
            console.error('Failed to update profile locally:', error);
            return { success: false, message: 'Failed to save changes.' };
        }
    };

    const value = {
        user,
        loading,
        login,
        signup,
        forgotPassword,
        resetPassword,
        logout,
        updateProfile
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};
