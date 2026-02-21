import apiClient from '../api/client';

export const cartService = {
    /**
     * Add item to cart
     * POST /api/services/app/Cart/AddToCart
     */
    addToCart: async (product, quantity = 1, userId = 0) => {
        const emptyGuid = '00000000-0000-0000-0000-000000000000';
        let storeProductId = null;

        try {
            // Priority for storeProductId:
            if (product.storeProductId && product.storeProductId !== emptyGuid) {
                storeProductId = product.storeProductId;
            } else if (product.store?.storeProductId && product.store.storeProductId !== emptyGuid) {
                storeProductId = product.store.storeProductId;
            } else if (product.id && product.id !== emptyGuid && product.id !== product.productId) {
                storeProductId = product.id;
            } else if (product.id && product.id !== emptyGuid && !product.productId) {
                storeProductId = product.id;
            }

            if (!storeProductId && typeof product === 'string') {
                storeProductId = product; // Handle cases where ID is passed directly
            }

            if (!storeProductId) {
                console.error('CartService: No valid storeProductId found for product:', product);
                throw new Error('Store product ID not found. Please try again.');
            }

            const payload = {
                userId: userId || 0,
                storeProductId: storeProductId,
                quantity: quantity
            };

            console.log('--- CART SERVICE: [POST] /api/services/app/Cart/AddToCart ---', payload);
            const response = await apiClient.post('/api/services/app/Cart/AddToCart', payload);
            return response.data;
        } catch (error) {
            console.error('CART SERVICE ERROR:', {
                status: error.response?.status,
                data: error.response?.data,
                message: error.message,
                payloadSent: { storeProductId, quantity, userId }
            });
            throw error;
        }
    },

    /**
     * Get all cart items
     * GET /api/services/app/Cart/GetCartItems
     */
    getCartItems: async (userId = 0) => {
        try {
            const response = await apiClient.get('/api/services/app/Cart/GetCartItems', {
                params: { userId }
            });
            const data = response.data;

            // Handle different response formats
            // The provided schema is an array, but ABP standard wraps it in 'result'
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
                Id: cartItemId,
                Quantity: quantity
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
                params: { Id: cartItemId }
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
