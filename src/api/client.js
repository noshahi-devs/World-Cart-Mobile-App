import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Smart Store Backend URL
const BASE_URL = 'https://elicom-api.noshahidev.com';

const apiClient = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
        'Abp-TenantId': '1', // Important: Identifies the Smart Store tenant
    },
    timeout: 10000,
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
