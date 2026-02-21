import apiClient from '../api/client';

export const catalogService = {
    getAllCategories: async (maxResultCount = 100) => {
        try {
            const response = await apiClient.get('/api/services/app/Category/GetAll', {
                params: { maxResultCount }
            });
            // Flexible extraction: Azure backend might send direct data or wrapped in 'result'
            const data = response.data;
            if (data.result) return data.result.items || data.result;
            return data.items || data;
        } catch (error) {
            console.error('Error fetching categories:', {
                status: error.response?.status,
                data: error.response?.data,
                message: error.message
            });
            throw error;
        }
    },

    getProductsForHome: async (skipCount = 0, maxResultCount = 20) => {
        try {
            const response = await apiClient.get('/api/services/app/Homepage/GetAllProductsForCards', {
                params: { skipCount, maxResultCount }
            });
            const data = response.data;
            if (data.result) return data.result.items || data.result;
            return data.items || data;
        } catch (error) {
            console.error('Error fetching home products:', {
                status: error.response?.status,
                data: error.response?.data,
                message: error.message
            });
            throw error;
        }
    },

    getCategoriesWithListedProducts: async () => {
        try {
            const response = await apiClient.get('/api/services/app/Homepage/GetCategoriesWithListedProducts');
            const data = response.data;
            if (data.result) return data.result;
            return data;
        } catch (error) {
            console.error('Error fetching categories with products:', {
                status: error.response?.status,
                data: error.response?.data,
                message: error.message
            });
            throw error;
        }
    },

    getProductListingsAcrossStores: async (skipCount = 0, maxResultCount = 20) => {
        try {
            const response = await apiClient.get('/api/services/app/Homepage/GetProductListingsAcrossStores', {
                params: { skipCount, maxResultCount }
            });
            const data = response.data;
            if (data.result) return data.result;
            return data;
        } catch (error) {
            console.error('Error fetching cross-store product listings:', {
                status: error.response?.status,
                data: error.response?.data,
                message: error.message
            });
            throw error;
        }
    },

    getProductsByStore: async (storeId, skipCount = 0, maxResultCount = 20) => {
        try {
            const response = await apiClient.get('/api/services/app/Homepage/GetProductsByStore', {
                params: { storeId, skipCount, maxResultCount }
            });
            const data = response.data;
            if (data.result) return data.result;
            return data;
        } catch (error) {
            console.error('Error fetching products by store:', {
                status: error.response?.status,
                data: error.response?.data,
                message: error.message
            });
            throw error;
        }
    },

    getProductDetail: async (productId) => {
        // FIXED: More flexible validation - only check if productId exists
        // Allow empty GUID to reach API since backend might handle it
        if (!productId) {
            throw new Error('Product ID is required');
        }

        // Just log warning for empty GUID, don't block the API call
        if (productId === '00000000-0000-0000-0000-000000000000') {
            console.warn('Warning: Empty GUID being sent to API - backend may return 500');
            // Continue with API call instead of throwing error
        }

        try {
            console.log('Calling API with productId:', productId); // Debug log

            const response = await apiClient.get('/api/services/app/Homepage/GetProductDetail', {
                params: { productId }
            });

            const data = response.data;
            console.log('API Response:', data); // Debug log

            // Handle different response formats
            if (data.result) {
                return data.result;
            }

            return data;

        } catch (error) {
            console.error('Error fetching product detail:', error);

            // Better error messages
            if (error.response) {
                // The request was made and the server responded with a status code
                // that falls out of the range of 2xx
                console.error('Response data:', error.response.data);
                console.error('Response status:', error.response.status);

                if (error.response.status === 500) {
                    throw new Error('Server error. Please try again later.');
                }
            } else if (error.request) {
                // The request was made but no response was received
                throw new Error('Network error. Please check your connection.');
            }

            throw error;
        }
    }
};