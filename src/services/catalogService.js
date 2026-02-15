import apiClient from '../api/client';

export const catalogService = {
    getAllCategories: async (maxResultCount = 100) => {
        try {
            const response = await apiClient.get('/api/services/app/Category/GetAll', {
                params: { maxResultCount }
            });
            // ABP response wrapper: { result: { ... }, success: true, ... }
            return response.data.result;
        } catch (error) {
            console.error('Error fetching categories:', error);
            throw error;
        }
    },

    getProductsForHome: async (skipCount = 0, maxResultCount = 20) => {
        try {
            const response = await apiClient.get('/api/services/app/Homepage/GetAllProductsForCards', {
                params: { skipCount, maxResultCount }
            });
            return response.data.result;
        } catch (error) {
            console.error('Error fetching home products:', error);
            throw error;
        }
    },

    getProductDetail: async (productId, storeProductId) => {
        try {
            // Assumed endpoint based on convention and user prompt hint
            const response = await apiClient.get('/api/services/app/Product/GetProductDetail', {
                params: { productId, storeProductId }
            });
            return response.data.result;
        } catch (error) {
            // console.error('Error fetching product detail:', error);
            throw error;
        }
    }
};
