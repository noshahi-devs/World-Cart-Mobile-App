import apiClient from '../api/client';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const authService = {
    // Customer Login
    // Endpoint: /api/TokenAuth/Authenticate
    login: async (email, password) => {
        try {
            const payload = {
                userNameOrEmailAddress: email,
                password: password,
                rememberClient: false
            };

            const response = await apiClient.post('/api/TokenAuth/Authenticate', payload);

            // Smart Store likely returns { result: { accessToken: "...", ... } }
            // We need to inspect the response structure. 
            // Assuming standard ABP framework response based on endpoint structure.
            const { accessToken, encryptedAccessToken, userId } = response.data.result;

            if (accessToken) {
                await AsyncStorage.setItem('userToken', accessToken);
                // Store basic user info if available, or fetch profile later
                await AsyncStorage.setItem('userData', JSON.stringify({ email, id: userId }));
                return { success: true, token: accessToken, userId };
            }
            return { success: false, message: 'No access token received' };
        } catch (error) {
            console.error('Login Error:', {
                message: error.message,
                code: error.code,
                response: error.response?.data,
            });
            if (error.message === 'Network Error') {
                if (Platform.OS === 'web') {
                    throw { message: 'Network Error (CORS): Please test on a mobile device/emulator or use a CORS browser extension.' };
                }
                throw { message: 'Unable to connect to server. Please check your internet connection.' };
            }
            throw error.response?.data?.error || { message: 'Login failed. Please try again.' };
        }
    },

    // Customer Signup
    // Endpoint: /api/services/app/Account/RegisterSmartStoreCustomer
    register: async ({ email, password, country, phone, fullName }) => {
        try {
            const payload = {
                emailAddress: email,
                password: password,
                country: country,
                phoneNumber: phone,
                fullName: fullName // VALIDATED: Required by backend
            };

            const response = await apiClient.post('/api/services/app/Account/RegisterSmartStoreCustomer', payload);
            return response.data;
        } catch (error) {
            console.error('Signup Error:', {
                message: error.message,
                code: error.code,
                status: error.response?.status,
                data: error.response?.data,
                url: error.config?.url,
                method: error.config?.method
            });
            if (error.message === 'Network Error') {
                if (Platform.OS === 'web') {
                    throw { message: 'Network Error (CORS): Please test on a mobile device/emulator or use a CORS browser extension.' };
                }
                throw { message: 'Unable to connect to server. Please check your internet connection.' };
            }
            throw error.response?.data?.error || { message: 'Signup failed. Please try again.' };
        }
    },

    // Get Current Session Info
    // Endpoint: /api/services/app/Session/GetCurrentLoginInformations
    getUserProfile: async () => {
        try {
            const response = await apiClient.get('/api/services/app/Session/GetCurrentLoginInformations');
            return response.data.result;
        } catch (error) {
            console.error('Fetch Profile Error:', error);
            throw error;
        }
    },

    // Logout
    logout: async () => {
        try {
            await AsyncStorage.removeItem('userToken');
            await AsyncStorage.removeItem('userData');
        } catch (error) {
            console.error('Logout error:', error);
        }
    }
};

export default authService;
