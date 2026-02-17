import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Smart Store Backend URL
export const BASE_URL = 'https://app-elicom-backend.azurewebsites.net';

const apiClient = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
        'Abp-TenantId': '1',
        'X-Requested-With': 'XMLHttpRequest',
    },
    timeout: 30000,
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
    async (config) => {
        const token = await AsyncStorage.getItem('userToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default apiClient;
