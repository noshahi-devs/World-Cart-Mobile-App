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
            // Step 1: Get basic session info (gives us the userId)
            const session = await authService.getUserProfile();

            if (session && session.user) {
                try {
                    // Step 2: Get detailed user record using the ID from session
                    // Note: This endpoint (/api/services/app/User/Get) often requires Admin permissions
                    const detailedUser = await authService.getUserDetails(session.user.id);

                    if (detailedUser) {
                        const fullUserData = {
                            ...session.user,      // Session data (tenant info, etc)
                            ...detailedUser,     // Detailed data (name, surname, etc)
                            id: session.user.id, // Ensure ID is preserved
                        };

                        setUser(fullUserData);
                        await AsyncStorage.setItem('userData', JSON.stringify(fullUserData));
                    }
                } catch (userGetError) {
                    if (userGetError.response?.status === 403) {
                        console.log('User/Get is restricted (403). Using session info only.');
                        // If we can't get detailed info, just use the session info we already have
                        const basicUserData = {
                            ...session.user,
                            id: session.user.id,
                        };
                        setUser(basicUserData);
                        await AsyncStorage.setItem('userData', JSON.stringify(basicUserData));
                    } else {
                        throw userGetError;
                    }
                }
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

    // 📝 UPDATE PROFILE (NOW CALLS BACKEND)
    const updateProfile = async (profileData) => {
        try {
            // Map our local fields back to what User/Update expects
            const updatePayload = {
                ...user, // Keep existing fields (id, roleNames, etc)
                name: profileData.firstName || user?.name || '',
                surname: profileData.lastName || user?.surname || '',
                emailAddress: profileData.email || user?.emailAddress || '',
                userName: user?.userName || profileData.email, // userName is usually same as email
                isActive: true
            };

            const updatedUserDetails = await authService.updateUser(updatePayload);

            if (updatedUserDetails) {
                const finalUser = {
                    ...user,
                    ...updatedUserDetails,
                    // Re-calculate fullName for display
                    fullName: `${updatedUserDetails.name} ${updatedUserDetails.surname}`
                };

                setUser(finalUser);
                await AsyncStorage.setItem('userData', JSON.stringify(finalUser));
                return { success: true };
            }
            return { success: false, message: 'Update failed' };
        } catch (error) {
            console.error('Failed to update profile on server:', error);
            return {
                success: false,
                message: error.message || 'Failed to save changes to server.'
            };
        }
    };

    // 🔑 CHANGE PASSWORD
    const changePassword = async (currentPassword, newPassword) => {
        try {
            await authService.changePassword(currentPassword, newPassword);
            return { success: true };
        } catch (error) {
            return { success: false, message: error.message };
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
        updateProfile,
        changePassword
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};
