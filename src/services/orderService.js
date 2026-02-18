import apiClient from '../api/client';

const orderService = {
    /**
     * Create a new order
     * POST /api/services/app/Order/Create
     * @param {Object} orderData - The complete order payload
     */
    createOrder: async (orderData) => {
        try {
            console.log('OrderService - Sending CreateOrder to:', apiClient.defaults.baseURL + '/api/services/app/Order/Create');
            const response = await apiClient.post('/api/services/app/Order/Create', orderData);
            return response.data;
        } catch (error) {
            // Enhanced logging for Network Errors
            if (!error.response) {
                console.error('OrderService - FATAL NETWORK ERROR (No Response):', error.message);
            } else {
                console.error('OrderService - API ERROR:', {
                    status: error.response.status,
                    data: error.response.data
                });
            }
            throw error;
        }
    },

    /**
     * Validate EasyFinora card and check balance
     * POST /api/services/app/Card/ValidateCard
     */
    validateCard: async (cardData) => {
        try {
            console.log('OrderService - Validating Card:', { ...cardData, cardNumber: 'XXXX-XXXX-XXXX-' + cardData.cardNumber?.slice(-4) });
            const response = await apiClient.post('/api/services/app/Card/ValidateCard', cardData);
            return response.data;
        } catch (error) {
            console.error('OrderService - ValidateCard ERROR:', error);
            throw error;
        }
    },

    /**
     * Get order details by ID
     */
    getOrderDetails: async (orderId) => {
        try {
            const response = await apiClient.get('/api/services/app/Order/Get', {
                params: { id: orderId }
            });
            return response.data.result;
        } catch (error) {
            console.error('OrderService - GetOrder ERROR:', error);
            throw error;
        }
    }
};

export default orderService;
