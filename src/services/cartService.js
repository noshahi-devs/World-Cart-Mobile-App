import apiClient from '../api/client';

export const cartService = {
    /**
     * Add item to cart
     * POST /api/services/app/Cart/AddToCart
     */
    addToCart: async (storeProductId, quantity = 1, userId = 0) => {
        try {
            const response = await apiClient.post('/api/services/app/Cart/AddToCart', {
                userId: userId, // Use provided userId or 0 for guest
                storeProductId,
                quantity
            });
            return response.data;
        } catch (error) {
            console.error('Error adding to cart:', error);
            throw error;
        }
    },

    /**
     * Get all cart items
     * GET /api/services/app/Cart/GetCartItems
     */
    getCartItems: async () => {
        try {
            const response = await apiClient.get('/api/services/app/Cart/GetCartItems');
            const data = response.data;

            // Handle different response formats
            if (data.result) {
                return data.result.items || data.result || [];
            }
            return data.items || data || [];
        } catch (error) {
            console.error('Error fetching cart items:', error);
            throw error;
        }
    },

    /**
     * Update cart item quantity
     * PUT /api/services/app/Cart/UpdateCartItem (if exists)
     */
    updateCartItem: async (cartItemId, quantity) => {
        try {
            const response = await apiClient.put('/api/services/app/Cart/UpdateCartItem', {
                id: cartItemId,
                quantity
            });
            return response.data;
        } catch (error) {
            console.error('Error updating cart item:', error);
            throw error;
        }
    },

    /**
     * Remove item from cart
     * DELETE /api/services/app/Cart/RemoveFromCart
     */
    removeFromCart: async (cartItemId) => {
        try {
            const response = await apiClient.delete('/api/services/app/Cart/RemoveFromCart', {
                params: { id: cartItemId }
            });
            return response.data;
        } catch (error) {
            console.error('Error removing from cart:', error);
            throw error;
        }
    },

    /**
     * Clear entire cart
     * DELETE /api/services/app/Cart/ClearCart (if exists)
     */
    clearCart: async () => {
        try {
            const response = await apiClient.delete('/api/services/app/Cart/ClearCart');
            return response.data;
        } catch (error) {
            console.error('Error clearing cart:', error);
            throw error;
        }
    }
};

export default cartService;
