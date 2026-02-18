import apiClient from '../api/client';

export const cartService = {
    /**
     * Add item to cart
     * POST /api/services/app/Cart/AddToCart
     */
    addToCart: async (product, quantity = 1, userId = 0) => {
        const emptyGuid = '00000000-0000-0000-0000-000000000000';
        let selectedTargetId = null;

        try {
            // Robust ID selection: prefer productId, fallback to id, then storeProductId, but avoid empty GUIDs
            if (product.productId && product.productId !== emptyGuid) {
                selectedTargetId = product.productId;
            } else if (product.id && product.id !== emptyGuid) {
                selectedTargetId = product.id;
            } else if (product.storeProductId && product.storeProductId !== emptyGuid) {
                selectedTargetId = product.storeProductId;
            }

            if (!selectedTargetId) {
                console.error('CartService: No valid ID found for product:', product);
                throw new Error('Invalid product ID');
            }

            // Robust payload: try both productId and storeProductId keys
            const payload = {
                productId: selectedTargetId,
                storeProductId: selectedTargetId,
                quantity: quantity
            };

            // Add storeId if available
            const storeId = product.store?.storeId || product.storeId;
            if (storeId) {
                payload.storeId = storeId;
            }

            console.log('CartService - Attempting AddToCart with payload:', JSON.stringify(payload, null, 2));

            // Only send userId if it's a real value (non-zero)
            if (userId && userId !== 0) {
                payload.userId = userId;
            }

            const response = await apiClient.post('/api/services/app/Cart/AddToCart', payload);
            console.log('CartService - AddToCart Success:', response.data);
            return response.data;
        } catch (error) {
            console.error('Error adding to cart:', {
                message: error.message,
                status: error.response?.status,
                data: error.response?.data,
                productTitle: product?.title,
                selectedTargetId,
                quantity,
                userId
            });
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
