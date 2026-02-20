import apiClient from '../api/client';

const cardService = {
    /**
     * Get Card Balance
     * GET /api/services/app/Card/GetBalance
     * Note: Typically GET requests use query parameters. 
     * We will pass the card details as params.
     */
    getBalance: async (cardNumber, cvv, expiryDate) => {
        try {
            // Removing spaces from card number for API
            const cleanCardNumber = cardNumber.replace(/\s/g, '');

            console.log('CardService - Fetching Balance', { cardNumber: `****${cleanCardNumber.slice(-4)}` });

            const response = await apiClient.get('/api/services/app/Card/GetBalance', {
                params: {
                    cardNumber: cleanCardNumber,
                    cvv: cvv,
                    expirationDate: expiryDate // Assuming API expects 'MM/YY' or similar
                }
            });

            return response.data;
        } catch (error) {
            console.error('CardService - GetBalance ERROR:', error);
            throw error;
        }
    },

    /**
     * Validate Card (Alternative if GetBalance requires validation first)
     * POST /api/services/app/Card/ValidateCard
     */
    validateCard: async (cardData) => {
        try {
            const response = await apiClient.post('/api/services/app/Card/ValidateCard', cardData);
            return response.data;
        } catch (error) {
            console.error('CardService - ValidateCard ERROR:', error);
            throw error;
        }
    }
};

export default cardService;
